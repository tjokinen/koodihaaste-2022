import React, { useEffect, useState, useRef } from "react"
import "./App.scss"
import CustomDropdown from "./CustomDropdown"
import { Button, Container, Image, Row, Col } from 'react-bootstrap'
import TwoCards from "./TwoCards"
import TwoCards2 from "./TwoCards2"
import CustomModal from "./CustomModal"

export default function App() {

    const [foodCode1, setFoodCode1] = useState('')
    const [foodCode2, setFoodCode2] = useState('')
    const [results, setResults] = useState('')
    const [foodValues1, setFoodValues1] = useState([]) // name, id, health(kcal), attack(carbs), protein(defense), fat  
    const [foodValues2, setFoodValues2] = useState([])
    const [phase, setPhase] = useState('start')
    const [show, setShow] = useState(false) //modal (CustomModal) state
    const [modalText, setModalText] = useState('')
    const [modalHeading, setModalHeading] = useState('')
    const [randomList, setRandomList] = useState([]) // background animation
    const [seconds, setSeconds] = useState(0)
    const [step, setStep] = useState(0)
    const bottomRef = useRef(null)

    //set opponent foodcode
    useEffect(() => {
        if (foodCode1 != '' && foodCode2 == '') {
            let codes = [300, 29279, 32766, 28923, 386, 29806, 28920, 330, 350]
            setFoodCode2(codes[Math.floor(Math.random() * 9)]) // select random food code from predefined (above) list
        }
    }, [foodCode1])

    //fetch food values when food code is set
    useEffect(() => {
        if (foodCode1 != '') {
            getFoodValues(foodCode1, setFoodValues1)
        }
        if (foodCode2 != '') {
            getFoodValues(foodCode2, setFoodValues2)
        }
    }, [foodCode1, foodCode2])

    //THIS WILL RUN EVERY SECOND
    useEffect(() => {
        const interval = setInterval(() => {
            if (phase == 'running' && results != '') {
                if (step >= results.length) {
                    //END GAME

                    setPhase('end')

                    let winner = ''
                    if (foodValues1[2] <= 0) {
                        winner = foodValues2[0]
                    } else {
                        winner = foodValues1[0]
                    }

                    setModalHeading(winner + ' voittaa!')
                    setModalText('Peli päättyi. ' + winner + ' voitti pelin!')
                    setShow(true) // display modal
                } else if (results[step].timestamp <= seconds) {
                    let i = step
                    if (foodCode1 == results[i].attackerId) {
                        let temp = foodValues1
                        temp[2] = results[i].attackerHealth
                        setFoodValues1(temp)

                        temp = foodValues2
                        temp[2] = results[i].defensorHealth
                        setFoodValues2(temp)
                    } else {
                        let temp = foodValues1
                        temp[2] = results[i].defensorHealth
                        setFoodValues1(temp)

                        temp = foodValues2
                        temp[2] = results[i].attackerHealth
                        setFoodValues2(temp)
                    }
                    setStep(step + 1)
                }
            }
            setSeconds(seconds + 1)
        }, 1000);
        return () => clearInterval(interval);
    }, [seconds]);

    const getFoodValues = (code, setterFunction) => {
        fetch("http://localhost:4000/nutritional-values", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json"
            },
            body: JSON.stringify({
                foodCode: code
            })
        })
            .then(r => r.json())
            .then(rJson => {
                setterFunction(rJson)
            })
    }

    //Start game
    const handleStart = () => {
        setSeconds(0)
        setPhase('running')
        fetch("http://localhost:4000/fight", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json"
            },
            body: JSON.stringify({
                foodCode1: foodCode1,
                foodCode2: foodCode2
            })
        })
            .then(r => r.json())
            .then(rJson => {
                setResults(rJson)
            })
    }

    const CardDropDown1 = <CustomDropdown setFoodCode={setFoodCode1} />
    const CardDropDown2 = <CustomDropdown setFoodCode={setFoodCode2} />

    const DisplayButton = () => {
        if (foodCode1 != '' && foodCode2 != '' && phase == 'start') {
            return <Button variant='success' onClick={() => { handleStart() }}>ALOITA PELI</Button>
        }
        return <></>
    }

    const DisplayResetButton = () => {
        if (phase == 'end') {
            return <Button variant='success' onClick={() => {window.location.reload(true)}}>ALOITA ALUSTA</Button>
        }
    }

    //TODO text color

    const DisplayResults = () => {
        if (results != '') {
            return (
                <ul>
                    <li>Taistelu alkaa!</li>
                    {results.map((line, index) => {
                        if (line.timestamp <= seconds) {
                            //SET UP TEXT COLOR CLASS
                            let colorClass = ''
                            if (line.attackerId == foodCode1) {
                                colorClass = 'liGreen'
                            } else {
                                colorClass = 'liRed'
                            }
                            //SCROLL TO VIEW NEW LINE
                            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                            return <li className={colorClass} key={index}>{line.attackerName} lyö ja tekee {line.damage} vahinkoa! {line.defensorName}lle jää {line.defensorHealth} Health.</li>
                        }
                    })}
                </ul>
            )
        }
    }

    useEffect(() => {
        let temp = []
        for (let i = 0; i < 30; i++) {
            let imageNumber = Math.floor(Math.random() * 11 + 1) //random number 1-11 (11 images)
            let leftPos = Math.floor(Math.random() * 95)
            let delay = Math.floor(Math.random() * -31)
            temp.push([imageNumber, leftPos, delay])
        }
        setRandomList(temp)
    }, [])

    return (
        <Container>
            <CustomModal showState={show} showStateSetter={setShow} heading={modalHeading} text={modalText} />
            <Container>
                <Row className="justify-content-center">
                    <Col className="d-flex justify-content-center" xs={5}>
                        <Image className="image-banner" src="./images/burgerandpizza.png" fluid />
                    </Col>
                </Row>
            </Container>
            <div className="Title">
                <h1>RuokaRähinä</h1>
                <p>Mätömpi ruoka voittaa!</p>
            </div>
            <Container className="cards-container">
                <Row>
                    <Col>
                        {/*<TwoCards phase={phase} dropDown1={CardDropDown1} dropDown2={CardDropDown2} text1={foodValues1} text2={foodValues2} />*/}
                        <TwoCards2 phase={phase} dropDown1={CardDropDown1} text1={foodValues1} text2={foodValues2} />
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="d-flex justify-content-center">
                        <DisplayButton />
                        <DisplayResetButton />
                    </Col>
                </Row>
                <Container className="results-container">
                    <Row className="justify-content-center">
                        <Col className="results-display" xs={12}>
                            <DisplayResults />
                            <div ref={bottomRef} />
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col className="justify-content-center">
                            <span className="tag-and-link">Solidabiksen koodihaaste 2022 <a href="https://github.com/tjokinen/">github.com/tjokinen/</a></span>
                        </Col>
                    </Row>
                </Container>
            </Container>
            <Container className="animation-container">
                {randomList.map((item, index) => {
                    return <Image className="animated-food" key={index} style={{ left: item[1] + 'vw', animationDelay: item[2] + 's' }} src={"./images/food" + item[0] + ".png"} />
                })}
            </Container>
        </Container>
    );
}