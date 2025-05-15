import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { getContract } from "../../utils/doctorContract";

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

  const fetchDoctorSchedules = async (doctorId) => {
    if (!doctorId) return;
    
    setLoadingSchedules(true);
    setScheduleError(null);
    setSelectedSchedule("");

    try {
      const contract = await getContract();
      const schedules = await contract.getDoctorSchedules(doctorId);
      
      // Debug: Check the raw schedule data structure
      console.log("Raw schedule data:", schedules);

      const formattedSchedules = schedules.map(schedule => {
        // Handle different possible data structures
        const scheduleData = {
          id: schedule.id?.toString() || schedule[0]?.toString(),
          day: schedule.day || schedule[1],
          startTime: schedule.startTime || schedule.start || schedule[2],
          endTime: schedule.endTime || schedule.end || schedule[3],
          room: schedule.room || schedule[4]
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
      setScheduleError("Failed to load doctor schedules");
    } finally {
      setLoadingSchedules(false);
    }
  };

  const convertDayNumber = (dayNum) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dayNum] || `Day-${dayNum}`;
  };

  useEffect(() => {
    if (selectedDoctor?.id) {
      fetchDoctorSchedules(selectedDoctor.id);
    } else {
      setDoctorSchedules([]);
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (!show) {
      setSelectedDoctor(null);
      setSelectedSchedule("");
      setDoctorSchedules([]);
    }
  }, [show]);

  const handleSave = async () => {
    if (!selectedDoctor || !selectedSchedule) {
      alert("Please select both doctor and schedule");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedScheduleData = doctorSchedules.find(
        s => `${s.hariPraktek} ${s.waktuMulai} - ${s.waktuSelesai}` === selectedSchedule
      );

      if (!selectedScheduleData) {
        throw new Error("Selected schedule data not found");
      }

      const data = {
        namaPasien: selectedPatient?.namaLengkap || "",
        NIK: selectedPatient?.nik || "",
        namaDokter: selectedDoctor.namaDokter,
        spesialis: selectedDoctor.spesialis,
        nomorPraktek: selectedDoctor.nomorPraktek,
        jadwalDokter: selectedSchedule,
        ruangPraktek: selectedScheduleData.ruangPraktek || selectedDoctor.ruangPraktek,
      };

      await onSave(data);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error saving data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Outpatient Registration</Modal.Title>
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
                  <Form.Label>spesialisasi</Form.Label>
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
                    disabled={!selectedDoctor || loadingSchedules}
                  >
                    <option value="">Select Schedule</option>
                    {selectedDoctor && doctorSchedules.length > 0 ? (
                      doctorSchedules.map((schedule, index) => (
                        <option
                          key={index}
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