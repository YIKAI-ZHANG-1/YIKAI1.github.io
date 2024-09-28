import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaGraduationCap } from 'react-icons/fa'; // 使用 react-icons 中的图标

export default function HomePage() {
  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#ffffff' }}>
      <div className="text-center">
        {/* 图标 */}
        <div className="d-flex justify-content-center mb-4">  {/* 增加图标与标题之间的间距 */}
          <FaGraduationCap size={100} />
        </div>
        {/* 标题 */}
        <h1 className="mb-5" style={{ fontSize: '2.5rem', fontWeight: '600' }}>Welcome to the Course Management System</h1>  {/* 增加标题与按钮之间的间距 */}
        {/* 按钮 */}
        <Row className="justify-content-center">
          <Col xs="auto">
            <Button href="/courses" variant="primary" className="m-3 px-4 py-2" style={{ fontSize: '1.2rem' }}>Courses</Button>  {/* 增加按钮之间的间距 */}
          </Col>
          <Col xs="auto">
            <Button href="/students" variant="secondary" className="m-3 px-4 py-2" style={{ fontSize: '1.2rem' }}>Students</Button>
          </Col>
          <Col xs="auto">
            <Button href="/teachers" variant="success" className="m-3 px-4 py-2" style={{ fontSize: '1.2rem' }}>Teachers</Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
