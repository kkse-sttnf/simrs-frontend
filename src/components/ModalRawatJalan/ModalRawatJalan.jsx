import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { getContract as getOutpatientContract } from "../../utils/outpatientContract"; // Import untuk kontrak rawat jalan
import { getContract as getDoctorContract } from "../../utils/doctorContract";   // Import untuk kontrak dokter
import Swal from "sweetalert2";
import { ethers } from "ethers";

const ModalRawatJalan = ({
  show,
  handleClose,
  selectedPatient,
  dokter = [], // Ini adalah prop 'dokter' yang berisi daftar semua dokter dari parent
  onSave,     // Ini adalah prop 'handleSaveRawatJalan' dari parent
  loadingDokter,
  errorDokter
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize convertDayNumber as it's a stable helper function
  const convertDayNumber = useCallback((dayNum) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dayNum] || `Day-${dayNum}`;
  }, []);

  // Memoize fetchDoctorSchedules to prevent unnecessary re-creations
  const fetchDoctorSchedules = useCallback(async (doctorId) => {
    if (!doctorId) return;

    setLoadingSchedules(true);
    setScheduleError(null);
    setSelectedSchedule(""); // Clear selected schedule when doctor changes

    try {
      // PENTING: Gunakan getDoctorContract untuk mengambil jadwal dokter
      const doctorContract = await getDoctorContract();
      const schedules = await doctorContract.getDoctorSchedules(doctorId);

      const formattedSchedules = schedules.map(schedule => {
        const scheduleData = {
          id: schedule.id?.toString() || schedule[0]?.toString(),
          day: schedule.day || schedule[2],
          startTime: schedule.startTime || schedule.start || schedule[3],
          endTime: schedule.endTime || schedule.end || schedule[4],
          room: schedule.room || schedule[5]
        };

        return {
          id: scheduleData.id,
          hariPraktek: convertDayNumber(Number(scheduleData.day)),
          waktuMulai: scheduleData.startTime,
          waktuSelesai: scheduleData.endTime,
          ruangPraktek: scheduleData.room
        };
      });

      setDoctorSchedules(formattedSchedules);
    } catch (error) {
      console.error("Failed to load schedules:", error);
      // Pesan error yang lebih informatif
      setScheduleError("Gagal memuat jadwal dokter. Pastikan kontrak dokter terhubung dan fungsi 'getDoctorSchedules' tersedia di ABI-nya.");
    } finally {
      setLoadingSchedules(false);
    }
  }, [convertDayNumber]);

  // useEffect for fetching schedules when selectedDoctor changes
  useEffect(() => {
    if (selectedDoctor?.id) {
      fetchDoctorSchedules(selectedDoctor.id);
    } else {
      setDoctorSchedules([]);
      setSelectedSchedule("");
    }
  }, [selectedDoctor, fetchDoctorSchedules]);

  // useEffect for resetting state when modal closes
  useEffect(() => {
    if (!show) {
      setSelectedDoctor(null);
      setSelectedSchedule("");
      setDoctorSchedules([]);
      setScheduleError(null);
      setIsSubmitting(false);
    }
  }, [show]);

  const handleSave = async () => {
    if (!selectedPatient) {
      Swal.fire({
        icon: 'error',
        title: 'Pasien Belum Dipilih',
        text: 'Harap cari dan pilih pasien terlebih dahulu.',
      });
      return;
    }

    if (!selectedDoctor || !selectedSchedule) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: 'Harap pilih dokter dan jadwal terlebih dahulu',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedScheduleData = doctorSchedules.find(
        s => `${s.hariPraktek} ${s.waktuMulai} - ${s.waktuSelesai}` === selectedSchedule
      );

      if (!selectedScheduleData) {
        throw new Error("Data jadwal tidak ditemukan dalam daftar yang dimuat.");
      }

      const dataToSave = {
        namaPasien: selectedPatient?.namaLengkap || "",
        NIK: selectedPatient?.nik || "",
        namaDokter: selectedDoctor.namaDokter,
        spesialis: selectedDoctor.spesialis,
        nomorPraktek: selectedDoctor.nomorPraktek,
        jadwalDokter: selectedSchedule,
        ruangPraktek: selectedScheduleData.ruangPraktek || selectedDoctor.ruangPraktek,
      };

      // Create medical record hash from NIK
      const mrHash = ethers.keccak256(ethers.toUtf8Bytes(dataToSave.NIK));

      // Convert schedule text to ID (e.g., "Senin" -> 1)
      const scheduleId = convertJadwalToId(dataToSave.jadwalDokter);

      // PENTING: Gunakan getOutpatientContract untuk operasi antrian
      const outpatientContract = await getOutpatientContract();

      // Periksa apakah pasien sudah ada di antrian
      let existingQueueNumber;
      try {
        existingQueueNumber = await outpatientContract.getQueueNumber(mrHash);
      } catch (error) {
        // Tangani error decoding atau data yang tidak valid dari kontrak (misal: 0x)
        if (error.code === 'BAD_DATA' && error.value === '0x') {
            console.warn(`getQueueNumber for ${mrHash} returned 0x. Interpreting as 0.`);
            existingQueueNumber = ethers.toBigInt(0); // Mengembalikan BigInt 0 yang konsisten
        } else {
            throw error; // Lemparkan error lain
        }
      }

      if (existingQueueNumber.toString() !== "0") { // Check if not zero
        const result = await Swal.fire({
          title: 'Pasien Sudah Terdaftar',
          html: `Pasien ini sudah terdaftar dengan nomor antrian: <b>${existingQueueNumber.toString()}</b>. <br> Apakah Anda ingin mendaftar ulang?`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Ya, Daftar Ulang',
          cancelButtonText: 'Batal'
        });

        if (!result.isConfirmed) {
          setIsSubmitting(false);
          return false; // User cancelled re-registration
        }
      }

      // Show loading for transaction
      Swal.fire({
        title: 'Mengirim Transaksi',
        html: `Mendaftarkan pasien...<br>Hash MR: ${mrHash.slice(0, 10)}...`,
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // Enqueue patient
      const tx = await outpatientContract.enqueue(mrHash, scheduleId);
      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error("Transaksi pendaftaran rawat jalan gagal di blockchain.");
      }

      const queueNumber = await outpatientContract.getQueueNumber(mrHash);

      Swal.fire({
        icon: 'success',
        title: 'Pendaftaran Berhasil!',
        html: `
          <div>
            <p>Pendaftaran rawat jalan Anda telah disimpan di blockchain.</p>
            <p><strong>Nomor Antrian:</strong> ${queueNumber.toString()}</p>
            <p><strong>Jadwal:</strong> ${dataToSave.jadwalDokter}</p>
            <p><strong>Dokter:</strong> ${dataToSave.namaDokter}</p>
          </div>
        `,
        confirmButtonText: 'Oke'
      });

      handleClose(); // Close modal on success
      return true;

    } catch (error) {
      console.error("Error during registration:", error);

      let errorMessage = 'Terjadi kesalahan saat mendaftar rawat jalan.';
      if (error.message.includes("Patient already in queue")) {
        errorMessage = 'Pasien ini sudah terdaftar dalam antrian.';
      } else if (error.code === 'ACTION_REJECTED') {
        errorMessage = "Transaksi dibatalkan oleh pengguna.";
      } else if (error.code === 'CALL_EXCEPTION') {
        errorMessage = "Anda tidak memiliki izin untuk melakukan operasi ini atau ada masalah kontrak.";
      } else if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message.includes("execution reverted")) {
        errorMessage = "Transaksi gagal dieksekusi di blockchain. Periksa log kontrak.";
      }

      Swal.fire({
        icon: 'error',
        title: 'Gagal Mendaftar',
        text: errorMessage,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert schedule text to ID
  const convertJadwalToId = (jadwalText) => {
    const dayMap = {
      'senin': 1,
      'selasa': 2,
      'rabu': 3,
      'kamis': 4,
      'jumat': 5,
      'sabtu': 6,
      'minggu': 7
    };

    const lowerJadwal = jadwalText.toLowerCase();
    for (const [day, id] of Object.entries(dayMap)) {
      if (lowerJadwal.includes(day)) {
        return id;
      }
    }
    return 0; // Default ID if no match is found
  };


  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Form Daftar Rawat Jalan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorDokter && <Alert variant="danger">{errorDokter}</Alert>}
        {scheduleError && <Alert variant="danger">{scheduleError}</Alert>}

        <Form>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Patient Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedPatient?.namaLengkap || "Patient not found"}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>NIK</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedPatient?.nik || ""}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Select Doctor</Form.Label>
                {loadingDokter ? (
                  <div className="text-center">
                    <Spinner size="sm" animation="border" />
                    <span> Loading doctors...</span>
                  </div>
                ) : (
                  <Form.Select
                    value={selectedDoctor?.id || ""}
                    onChange={(e) => {
                      const doctorId = e.target.value;
                      const doctor = dokter.find((d) => d.id === doctorId);
                      setSelectedDoctor(doctor);
                    }}
                    disabled={loadingDokter || dokter.length === 0}
                  >
                    <option value="">Select Doctor</option>
                    {dokter.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.namaDokter} ({doctor.spesialis})
                      </option>
                    ))}
                  </Form.Select>
                )}
                {dokter.length === 0 && !loadingDokter && (
                  <div className="text-danger mt-1">
                    No doctor data available
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {selectedDoctor && (
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Spesialisasi</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedDoctor.spesialis}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Select Schedule</Form.Label>
                {loadingSchedules ? (
                  <div className="text-center">
                    <Spinner size="sm" animation="border" />
                    <span> Loading schedules...</span>
                  </div>
                ) : (
                  <Form.Select
                    value={selectedSchedule}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                    disabled={!selectedDoctor || loadingSchedules || doctorSchedules.length === 0} // Disable if no schedules
                  >
                    <option value="">Select Schedule</option>
                    {selectedDoctor && doctorSchedules.length > 0 ? (
                      doctorSchedules.map((schedule, index) => (
                        <option
                          key={schedule.id || index} // Use schedule.id as key if available, fallback to index
                          value={`${schedule.hariPraktek} ${schedule.waktuMulai} - ${schedule.waktuSelesai}`}
                        >
                          {`${schedule.hariPraktek}: ${schedule.waktuMulai} - ${schedule.waktuSelesai} (Room: ${schedule.ruangPraktek})`}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        {selectedDoctor ? "No available schedules" : "Please select a doctor first"}
                      </option>
                    )}
                  </Form.Select>
                )}
                {selectedDoctor && !loadingSchedules && doctorSchedules.length === 0 && (
                  <div className="text-danger mt-1">
                    No schedules available for this doctor.
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSubmitting || !selectedDoctor || !selectedSchedule}
        >
          {isSubmitting ? (
            <>
              <Spinner as="span" size="sm" animation="border" role="status" />
              {' Processing...'}
            </>
          ) : (
            'Register'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRawatJalan;
