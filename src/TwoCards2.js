import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function TwoCards2({ phase, dropDown1, dropDown2, text1, text2}) {

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

    const playerTitle = (textState, dropDown1, phase) => {
        if (phase == 'running') {
            return <>{textState[0]}</>
        }
        return <>{dropDown1}</>
    }

    const opponentTitle = (textState) => {
        if (textState != '') {
            return <>{textState[0]}</>
        }
    }

    const iconList = {
        300: 'food6.png',
        29279: 'food10.png',
        32766: 'food11.png',
        28923: 'food4.png',
        386: 'food5.png',
        29806: 'food2.png',
        28920: 'food3.png',
        330: 'food1.png',
        350: 'food8.png'
    }

    const image = (textState) => {
        if(textState != ''){
            if (iconList.hasOwnProperty(textState[1])) {
                return './images/'+iconList[textState[1]]
            }
        }
        return './images/fooddefault.png'
    }

    const SecondCard = () => {
        if (text1 != '')
            return (
                <Col>
                    <Card bg='secondary'>
                        <Card.Img variant="top" src={image(text2)} style={{maxWidth: '200px'}}/>
                        <Card.Body>
                            <Card.Title className="card-title-red">{opponentTitle(text2)}</Card.Title>
                            <Card.Text>
                                {text(text2, phase)}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            )
    }

    return (
        <Row xs={2}>
            <Col>
                <Card bg='secondary'>
                    <Card.Img variant="top" src={image(text1)}/>
                    <Card.Body>
                        <Card.Title className="card-title-green">{playerTitle(text1, dropDown1, phase)}</Card.Title>
                        <Card.Text>
                            {text(text1, phase)}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <SecondCard/>
        </Row>
    );
}

export default TwoCards2;