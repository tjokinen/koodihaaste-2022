import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from "next/image"

import img1 from "../images/food1.png"
import img2 from "../images/food2.png"
import img3 from "../images/food3.png"
import img4 from "../images/food4.png"
import img5 from "../images/food5.png"
import img6 from "../images/food6.png"
import img7 from "../images/food7.png"
import img8 from "../images/food8.png"
import img9 from "../images/food9.png"
import img10 from "../images/food10.png"
import img11 from "../images/food11.png"
import imgDefault from "../images/fooddefault.png"

function TwoCards2({ phase, dropDown1, dropDown2, text1, text2 }) {

    let initialHealth1 = text1[2]
    let initialHealth2 = text2[2]

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
            return <>
                <div style={{ height: "20px", backgroundColor: "green", width: (textState[2] / initialHealth1) * 100 + "%" }} />
                {textState[0]}
            </>
        }
        return <>{dropDown1}</>
    }

    const opponentTitle = (textState) => {
        if (textState != '') {
            return <>
            <div style={{ height: "20px", backgroundColor: "green", width: (textState[2] / initialHealth2) * 100 + "%" }} />
            {textState[0]}
            </>
        }
    }

    const iconList = {
        300: img6,
        29279: img10,
        32766: img11,
        28923: img4,
        386: img5,
        29806: img2,
        28920: img3,
        330: img1,
        350: img8
    }

    const image = (textState) => {
        if (textState != '') {
            if (iconList.hasOwnProperty(textState[1])) {
                return iconList[textState[1]]
            }
        }
        return imgDefault
    }

    const SecondCard = () => {
        if (text1 != '')
            return (
                <Col>
                    <Card bg='secondary'>
                        <Image src={image(text2)} style={{ maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }} alt="food" />
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
                    <Image src={image(text1)} style={{ maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }} alt="food" />
                    <Card.Body>
                        <Card.Title className="card-title-green">{playerTitle(text1, dropDown1, phase)}</Card.Title>
                        <Card.Text>
                            {text(text1, phase)}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <SecondCard />
        </Row>
    );
}

export default TwoCards2;