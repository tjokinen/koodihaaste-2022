import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function TwoCards({ phase, dropDown1, dropDown2, text1, text2 }) {

  const text = (textState, phase) => {
    if (textState != '') {
      if (phase != 'running') {
        return <>
          Health: {Math.round(textState[2] * 100) / 100}
          <br />Attack: {Math.round(textState[3] * 100) / 100}
          <br />Defense: {Math.round(textState[4] * 100) / 100}
          <br />Delay: {Math.round((textState[3] + textState[4] + textState[5]) * 100) / 100}
        </>
      }
      return <>
        Health: {Math.round(textState[2] * 100) / 100}
      </>
    }
    return <></>
  }

  return (
    <Row xs={2}>
      <Col>
        <Card bg='secondary'>
          <Card.Img variant="top" />
          <Card.Body>
            <Card.Title className="card-title-green">{dropDown1}</Card.Title>
            <Card.Text>
              {text(text1, phase)}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card bg='secondary'>
          <Card.Img variant="top" />
          <Card.Body>
            <Card.Title className="card-title-red">{dropDown2}</Card.Title>
            <Card.Text>
              {text(text2, phase)}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default TwoCards;