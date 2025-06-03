import { Container, Row, Col, Card, Form, Button, Spinner, Badge } from "react-bootstrap";
import { getContract as getOutpatientContract } from "../../utils/outpatientContract";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

const FormRawatJalan = ({ selectedPasien }) => {
  const [queueInfo, setQueueInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dequeueLoading, setDequeueLoading] = useState(false);

  useEffect(() => {
    const loadQueueData = async () => {
      if (!selectedPasien?.mrHash) {
        setQueueInfo(null);
        return;
      }

      setLoading(true);
      try {
        const outpatientContract = await getOutpatientContract();
        const info = await outpatientContract.getQueueInfo(selectedPasien.mrHash);
        
        setQueueInfo({
          mrHash: selectedPasien.mrHash,
          queueNumber: info.queueNumber.toString(),
          scheduleId: info.scheduleId.toString()
        });
      } catch (error) {
        console.error("Error memuat antrian:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal memuat detail antrian terbaru"
        });
      } finally {
        setLoading(false);
      }
    };

    loadQueueData();
  }, [selectedPasien]);

  const handleDequeue = async () => {
    if (!selectedPasien?.mrHash) return;

    const confirmation = await Swal.fire({
      title: "Konfirmasi",
      html: `Yakin ingin menghapus antrian pasien:<br>
        <b>${selectedPasien.namaPasien}</b><br>
        NIK: ${selectedPasien.NIK}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });

    if (!confirmation.isConfirmed) return;

    setDequeueLoading(true);
    try {
      const contract = await getOutpatientContract();
      const tx = await contract.dequeue(selectedPasien.mrHash);
      await tx.wait();
      
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        html: `Pasien <b>${selectedPasien.namaPasien}</b> telah dihapus dari antrian<br>
          <small>TX: ${tx.hash.slice(0, 10)}...</small>`
      });
      
      setQueueInfo(null);
    } catch (error) {
      console.error("Error menghapus antrian:", error);
      let errorMsg = error.reason?.replace('execution reverted: ', '') || "Gagal menghapus antrian";
      
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: errorMsg
      });
    } finally {
      setDequeueLoading(false);
    }
  };

  // Fungsi untuk mengkonversi ID jadwal ke hari
  const convertScheduleIdToDay = (id) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[id] || `Hari-${id}`;
  };

  return (
    <Container className="mb-5">
      <Card className="shadow-sm border-primary">
        <Card.Header className="bg-primary text-white d-flex justify-content-between">
          <h5 className="mb-0">Detail Antrian</h5>
          {queueInfo && (
            <Badge bg="light" text="dark" pill>
              Antrian #{queueInfo.queueNumber}
            </Badge>
          )}
        </Card.Header>
        
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Memuat data antrian...</p>
            </div>
          ) : queueInfo ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Nama Pasien</Form.Label>
                <Form.Control 
                  readOnly 
                  value={selectedPasien.namaPasien} 
                  className="fw-bold"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>NIK Pasien</Form.Label>
                <Form.Control 
                  readOnly 
                  value={selectedPasien.NIK} 
                />
              </Form.Group>

              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Medical Record Hash</Form.Label>
                    <Form.Control 
                      readOnly 
                      value={queueInfo.mrHash} 
                      className="font-monospace small"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Nomor Antrian</Form.Label>
                    <Form.Control 
                      readOnly 
                      value={queueInfo.queueNumber} 
                      className="text-center fw-bold"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Hari Praktek</Form.Label>
                    <Form.Control 
                      readOnly 
                      value={convertScheduleIdToDay(queueInfo.scheduleId)} 
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-danger"
                  onClick={handleDequeue}
                  disabled={dequeueLoading}
                >
                  {dequeueLoading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Memproses...
                    </>
                  ) : "Hapus dari Antrian"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-muted py-4">
              {selectedPasien 
                ? "Tidak ditemukan data antrian untuk pasien ini" 
                : "Silakan cari pasien terlebih dahulu"}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormRawatJalan;