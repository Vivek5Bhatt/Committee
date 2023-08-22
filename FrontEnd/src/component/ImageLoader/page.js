"use client"
import Image from "next/image";
import SpinImage from "public/images/Spin-1s-200px.svg";

const ImageLoader = () => {
    return (
        <span className="spinner_outer">
            <Image src={SpinImage} alt="Spin Image" width={50} height={50} />
        </span>
    );
}

export default ImageLoader;
