import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { getContract as getOutpatientContract, enqueuePatient, getQueueNumber } from "../../utils/outpatientContract";
import { getContract as getDoctorContract } from "../../utils/doctorContract";
import Swal from "sweetalert2";
import { ethers } from "ethers";

const ModalRawatJalan = ({
  show,
  handleClose,
  selectedPatient,
  dokter = [],
  onSave,
  loadingDokter,
  errorDokter
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convertDayNumber = useCallback((dayNum) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dayNum] || `Hari-${dayNum}`;
  }, []);

  const fetchDoctorSchedules = useCallback(async (doctorId) => {
    if (!doctorId) return;

    setLoadingSchedules(true);
    setScheduleError(null);
    setSelectedSchedule("");

    try {
      const doctorContract = await getDoctorContract();
      const schedules = await doctorContract.getDoctorSchedules(doctorId);

      const formattedSchedules = schedules.map(schedule => ({
        id: schedule[0]?.toString(),
        hariPraktek: convertDayNumber(Number(schedule[2])),
        waktuMulai: schedule[3],
        waktuSelesai: schedule[4],
        ruangPraktek: schedule[5]
      }));

      setDoctorSchedules(formattedSchedules);
    } catch (error) {
      console.error("Gagal memuat jadwal:", error);
      setScheduleError("Gagal memuat jadwal dokter. Silakan coba lagi.");
    } finally {
      setLoadingSchedules(false);
    }
  }, [convertDayNumber]);

  useEffect(() => {
    if (selectedDoctor?.id) {
      fetchDoctorSchedules(selectedDoctor.id);
    } else {
      setDoctorSchedules([]);
    }
  }, [selectedDoctor, fetchDoctorSchedules]);

  const handleSave = async () => {
    if (!selectedPatient) {
      Swal.fire("Error", "Pasien belum dipilih", "error");
      return;
    }

    if (!selectedDoctor || !selectedSchedule) {
      Swal.fire("Peringatan", "Harap pilih dokter dan jadwal", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedScheduleData = doctorSchedules.find(
        s => `${s.hariPraktek} ${s.waktuMulai}-${s.waktuSelesai}` === selectedSchedule
      );

      if (!selectedScheduleData) {
        throw new Error("Data jadwal tidak valid");
      }

      // Generate hash dari NIK pasien
      const mrHash = ethers.keccak256(ethers.toUtf8Bytes(selectedPatient.nik));
      const scheduleId = convertJadwalToId(selectedSchedule);

      // Cek apakah pasien sudah terdaftar menggunakan mrHashToQueueNumber
      const existingQueue = await getQueueNumber(mrHash);
      if (existingQueue.toString() !== "0") {
        const confirm = await Swal.fire({
          title: "Pasien Sudah Terdaftar",
          html: `Pasien ini sudah memiliki nomor antrian: <b>${existingQueue.toString()}</b>`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Daftar Ulang",
          cancelButtonText: "Batal"
        });

        if (!confirm.isConfirmed) {
          return;
        }
      }

      Swal.fire({
        title: "Memproses...",
        html: "Sedang mendaftarkan pasien",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // Eksekusi pendaftaran menggunakan enqueuePatient utility
      const tx = await enqueuePatient(mrHash, scheduleId);
      
      // Listen for PatientEnqueued event
      const contract = await getOutpatientContract();
      contract.on("PatientEnqueued", (hash, sId, queueNum) => {
        if (hash === mrHash) {
          Swal.fire({
            title: "Pendaftaran Berhasil!",
            html: `
              <div>
                <p>Nomor Antrian: <b>${queueNum}</b></p>
                <p>Dokter: ${selectedDoctor.namaDokter}</p>
                <p>Jadwal: ${selectedSchedule}</p>
                <small>TX Hash: ${tx.hash.slice(0, 10)}...</small>
              </div>
            `,
            icon: "success",
          });

          if (onSave) {
            onSave({
              patient: selectedPatient,
              doctor: selectedDoctor,
              schedule: selectedSchedule,
              queueNumber: queueNum.toString()
            });
          }

          handleClose();
          contract.removeAllListeners("PatientEnqueued");
        }
      });
      
    } catch (error) {
      console.error("Error:", error);
      let errorMsg = "Gagal mendaftarkan pasien";
      if (error.code === 'ACTION_REJECTED') {
        errorMsg = "Transaksi dibatalkan";
      } else if (error.reason) {
        errorMsg = error.reason;
      }
      Swal.fire("Error", errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertJadwalToId = (jadwalText) => {
    const dayMap = {
      'senin': 1, 'selasa': 2, 'rabu': 3, 
      'kamis': 4, 'jumat': 5, 'sabtu': 6, 'minggu': 7
    };

    const hari = jadwalText.toLowerCase().split(' ')[0];
    return dayMap[hari] || 0;
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Pendaftaran Rawat Jalan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorDokter && <Alert variant="danger">{errorDokter}</Alert>}
        {scheduleError && <Alert variant="danger">{scheduleError}</Alert>}

        <Form>
          {/* Form Data Pasien */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nama Pasien</Form.Label>
                <Form.Control 
                  readOnly 
                  value={selectedPatient?.namaLengkap || "Belum dipilih"} 
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>NIK</Form.Label>
                <Form.Control 
                  readOnly 
                  value={selectedPatient?.nik || ""} 
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Pilihan Dokter */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Pilih Dokter</Form.Label>
                {loadingDokter ? (
                  <div className="text-center">
                    <Spinner size="sm" /> Memuat data dokter...
                  </div>
                ) : (
                  <Form.Select
                    value={selectedDoctor?.id || ""}
                    onChange={(e) => {
                      const doc = dokter.find(d => d.id === e.target.value);
                      setSelectedDoctor(doc);
                    }}
                    disabled={loadingDokter}
                  >
                    <option value="">Pilih Dokter</option>
                    {dokter.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.namaDokter} ({doc.spesialis})
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Jadwal Praktek */}
          {selectedDoctor && (
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Pilih Jadwal</Form.Label>
                  {loadingSchedules ? (
                    <div className="text-center">
                      <Spinner size="sm" /> Memuat jadwal...
                    </div>
                  ) : (
                    <Form.Select
                      value={selectedSchedule}
                      onChange={(e) => setSelectedSchedule(e.target.value)}
                      disabled={loadingSchedules}
                    >
                      <option value="">Pilih Jadwal</option>
                      {doctorSchedules.map((schedule, i) => (
                        <option 
                          key={i} 
                          value={`${schedule.hariPraktek} ${schedule.waktuMulai}-${schedule.waktuSelesai}`}
                        >
                          {`${schedule.hariPraktek}: ${schedule.waktuMulai}-${schedule.waktuSelesai} (${schedule.ruangPraktek})`}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </Form.Group>
              </Col>
            </Row>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
          Batal
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSubmitting || !selectedDoctor || !selectedSchedule}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" /> Memproses...
            </>
          ) : "Daftarkan"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRawatJalan;