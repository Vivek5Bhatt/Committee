"use client";
import React from "react";
import { Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Loader = () => {
    return (
        <>
            <div>
                <Button variant="primary" size="md" className="w-100">
                    <Spinner
                        as="span"
                        variant="light"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        animation="border"
                    />
                    Loading...
                </Button>
            </div>
        </>
    );
}

export default Loader;
