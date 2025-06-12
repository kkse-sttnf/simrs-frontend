import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { getContract as getOutpatientContract, enqueuePatient, getQueueNumber, getQueueInfo } from "../../utils/outpatientContract";
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

      if (!schedules || schedules.length === 0) {
        throw new Error("Dokter ini belum memiliki jadwal praktek");
      }

      const formattedSchedules = schedules.map(schedule => ({
        id: schedule[0]?.toString(),
        hariPraktek: convertDayNumber(Number(schedule[2])),
        waktuMulai: schedule[3],
        waktuSelesai: schedule[4],
        ruangPraktek: schedule[5] || "Ruang Praktek 1"
      }));

      setDoctorSchedules(formattedSchedules);
    } catch (error) {
      console.error("Gagal memuat jadwal:", error);
      setScheduleError(error.message || "Gagal memuat jadwal dokter. Silakan coba lagi.");
    } finally {
      setLoadingSchedules(false);
    }
  }, [convertDayNumber]);

  const convertJadwalToId = (jadwalText) => {
    const dayMap = {
      'minggu': 0, 'senin': 1, 'selasa': 2, 
      'rabu': 3, 'kamis': 4, 'jumat': 5, 'sabtu': 6
    };

    const hari = jadwalText.toLowerCase().split(' ')[0];
    return dayMap[hari] ?? 0;
  };

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

      const mrHash = ethers.keccak256(ethers.toUtf8Bytes(selectedPatient.nik));
      const scheduleId = convertJadwalToId(selectedSchedule);

      // Cek apakah pasien sudah terdaftar
      const existingQueue = await getQueueNumber(mrHash);
      
      if (existingQueue > 0) {
        const queueInfo = await getQueueInfo(mrHash);
        
        const confirm = await Swal.fire({
          title: "Pasien Sudah Terdaftar",
          html: `
            <div>
              <p>Pasien ini sudah terdaftar dengan:</p>
              <ul>
                <li>Nomor Antrian: <b>${queueInfo.queueNumber}</b></li>
                <li>Jadwal: <b>${convertDayNumber(queueInfo.scheduleId)}</b></li>
              </ul>
              <p>Apakah Anda ingin mendaftarkan ulang?</p>
            </div>
          `,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Daftar Ulang",
          cancelButtonText: "Batal"
        });

        if (!confirm.isConfirmed) {
          return;
        }
      }

      // Setup event listener before sending transaction
      const contract = await getOutpatientContract();
      let eventReceived = false;
      
      const eventHandler = (hash, schedId, queueNum, event) => {
        eventReceived = true;
        contract.off("PatientEnqueued", eventHandler);
        
        const formattedSchedule = convertDayNumber(Number(schedId));
        
        Swal.fire({
          title: "Pendaftaran Berhasil!",
          html: `
            <div>
              <p>Pasien berhasil didaftarkan:</p>
              <ul>
                <li><strong>Nomor Antrian:</strong> ${queueNum.toString()}</li>
                <li><strong>Jadwal:</strong> ${formattedSchedule}</li>
              </ul>
              <p><strong>Detail Pasien:</strong></p>
              <ul>
                <li>Nama: ${selectedPatient.namaLengkap}</li>
                <li>NIK: ${selectedPatient.nik}</li>
                <li>Dokter: ${selectedDoctor.namaDokter}</li>
              </ul>
              <small>TX Hash: ${event.transactionHash.slice(0, 10)}...</small>
            </div>
          `,
          icon: "success"
        });

        if (onSave) {
          onSave({
            patient: selectedPatient,
            doctor: selectedDoctor,
            schedule: selectedSchedule,
            queueNumber: queueNum.toString(),
            transactionHash: event.transactionHash
          });
        }

        handleClose();
      };

      contract.on("PatientEnqueued", eventHandler);

      // Show loading indicator
      Swal.fire({
        title: "Memproses Pendaftaran",
        html: "Transaksi sedang diproses di blockchain...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // Send transaction
      const tx = await enqueuePatient(mrHash, scheduleId);
      
      // Set timeout for event
      setTimeout(() => {
        if (!eventReceived) {
          contract.on("PatientEnqueued", eventHandler);
          Swal.fire({
            title: "Transaksi Dikirim",
            text: "Transaksi berhasil",
            icon: "success"
          });
          handleClose();
        }
      }, 30000);

    } catch (error) {
      console.error("Error:", error);
      
      let errorMsg = "Gagal mendaftarkan pasien";
      if (error.code === 'ACTION_REJECTED') {
        errorMsg = "Transaksi dibatalkan oleh pengguna";
      } else if (error.reason) {
        errorMsg = error.reason.replace('execution reverted: ', '');
      } else {
        errorMsg = error.message;
      }

      Swal.fire({
        title: "Terjadi Kesalahan",
        text: errorMsg,
        icon: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedDoctor?.id) {
      fetchDoctorSchedules(selectedDoctor.id);
    } else {
      setDoctorSchedules([]);
    }
  }, [selectedDoctor, fetchDoctorSchedules]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Pendaftaran Rawat Jalan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorDokter && <Alert variant="danger">{errorDokter}</Alert>}
        {scheduleError && <Alert variant="danger">{scheduleError}</Alert>}

        <Form>
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

          {selectedDoctor && (
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Pilih Jadwal</Form.Label>
                  {loadingSchedules ? (
                    <div className="text-center">
                      <Spinner size="sm" /> Memuat jadwal...
                    </div>
                  ) : doctorSchedules.length === 0 ? (
                    <Alert variant="warning">Dokter ini belum memiliki jadwal praktek</Alert>
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
              <Spinner as="span" size="sm" animation="border" role="status" />
              <span className="ms-2">Memproses...</span>
            </>
          ) : "Daftarkan"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRawatJalan;