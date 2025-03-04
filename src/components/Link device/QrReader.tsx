import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Button } from "../ui/button";
import { Scan } from "lucide-react";
import { getDataWithDeviceLinkKey } from "./link_device_services";
import { decryptPrivateKeyWithPassword } from "../../crypto/decrypt";
interface Props {
  // define your props here
  openQrReader: boolean;
  setOpenQrReader: (open: boolean) => void;
}

const QrReader: React.FC<Props> = ({ openQrReader, setOpenQrReader }) => {
  // QR states
  const scanner = useRef<QrScanner>();
  const videEle = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState(true);

  // handle password
  // const handlePassword = (value: string) => {
  //   setPassword(value);
  // };

  // result
  const [scannedResult] = useState<string>("");
  // const [password, setPassword] = useState<string>("");

  // sucess;
  const onScanSuccess = async (result: QrScanner.ScanResult) => {
    console.log("key", result.data);
    if (result.data.length > 0) {
      setOpenQrReader(false);
      handleScannedData(result.data);
    }
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    console.error(err);
  };

  const handleScannedData = async (key: string) => {
    // get data using device link key
    const { deviceLinkEncryptedKey, deviceLinkIv, deviceLinkSalt } =
      await getDataWithDeviceLinkKey(key);

    // decrypt the received data
    const decrypteData = await decryptPrivateKeyWithPassword(
      "12345",
      deviceLinkEncryptedKey,
      deviceLinkIv,
      deviceLinkSalt
    );
    console.table(decrypteData);
  };

  useEffect(() => {
    if (videEle.current && !scanner.current) {
      // instantiate the scanner
      scanner.current = new QrScanner(videEle?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    // clean up on unmount
    return () => {
      if (!videEle.current) {
        scanner.current?.stop();
      }
    };
  }, [openQrReader]);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  

  if (openQrReader) {
    return (
      <div className="qr-reader">
        {/* QR */}
        <video ref={videEle}></video>
        <div ref={qrBoxEl} className="flex justify-center items-center">
          {!videEle?.current && (
            <Scan width={350} height={350} color="white" strokeWidth={0.3} />
          )}
        </div>
      </div>
    );
    // } else if (!openQrReader && scannedResult?.length > 0) {
    //   return (
    //     <>
    //       <input
    //         type="text"
    //         placeholder="Enter password"
    //         onChange={(e) => handlePassword(e.target.value)}
    //         value={password}
    //         className="p-2 rounded-xl text-muted-foreground bg-background"
    //       />
    //       <button onClick={handleScannedData}>Submit</button>
    //     </>
    //   );
  } else if (!openQrReader && scannedResult.length === 0) {
    return (
      <Button
        variant="outline"
        className="bg-background"
        onClick={() => setOpenQrReader(true)}
      >
        Scan QRcode
      </Button>
    );
  }
};

export default QrReader;
