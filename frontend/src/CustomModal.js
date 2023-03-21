import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function CustomModal({ showState, showStateSetter, heading, text}) {

    const handleClose = () => showStateSetter(false);

    return (
            <Modal show={showState} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{heading}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{text}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Sulje
                    </Button>
                </Modal.Footer>
            </Modal>
    );
}