import { Container, Row, Col, Card, Form, Button, Spinner, Badge } from "react-bootstrap";
import { getContract } from "../../utils/outpatientContract";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

const FormRawatJalan = ({ selectedPasien }) => {
  const [queueInfo, setQueueInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dequeueLoading, setDequeueLoading] = useState(false);

  useEffect(() => {
    const loadQueueData = async () => {
      if (!selectedPasien?.NIK) {
        setQueueInfo(null);
        return;
      }

      setLoading(true);
      try {
        // For real-time validation, we could call getQueueInfo again
        // But here we use the data passed from Search component
        setQueueInfo({
          mrHash: selectedPasien.mrHash,
          queueNumber: selectedPasien.queueNumber,
          scheduleId: selectedPasien.scheduleId
        });
      } catch (error) {
        console.error("Error loading queue:", error);
        Swal.fire("Error", "Gagal memuat detail antrian", "error");
      } finally {
        setLoading(false);
      }
    };

    loadQueueData();
  }, [selectedPasien]);

  const handleDequeue = async () => {
    const confirmation = await Swal.fire({
      title: "Konfirmasi",
      text: `Yakin ingin menghapus antrian pasien ${selectedPasien.NIK}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });

    if (!confirmation.isConfirmed) return;

    setDequeueLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.dequeue(selectedPasien.NIK);
      await tx.wait();
      
      Swal.fire("Berhasil!", "Pasien telah dihapus dari antrian", "success");
      setQueueInfo(null); // Clear the form
    } catch (error) {
      console.error("Dequeue error:", error);
      Swal.fire("Gagal", error.reason || "Gagal menghapus antrian", "error");
    } finally {
      setDequeueLoading(false);
    }
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
            </div>
          ) : queueInfo ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>NIK Pasien</Form.Label>
                <Form.Control 
                  readOnly 
                  value={selectedPasien.NIK} 
                  className="fw-bold"
                />
              </Form.Group>

              <Row className="mb-4">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Medical Record Hash</Form.Label>
                    <Form.Control 
                      readOnly 
                      value={queueInfo.mrHash} 
                      className="font-monospace"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Nomor Antrian</Form.Label>
                    <Form.Control 
                      readOnly 
                      value={queueInfo.queueNumber} 
                    />
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>ID Jadwal</Form.Label>
                    <Form.Control 
                      readOnly 
                      value={queueInfo.scheduleId} 
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
                ? "Tidak ditemukan data antrian" 
                : "Hasil pencarian akan muncul di sini"}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormRawatJalan;