import React, { useState } from "react";
import { MonitorSmartphone, Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import { getPrivateKeyFromIndexedDB } from "../../crypto/key_manager";
import { exportPrivateKey } from "../../crypto/utils";
import { encryptPrivateKey } from "../../crypto/encrypt";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { addDeviceLinkKey } from "./link_device_services";

interface Props {
  // define your props here
}

const LinkDevice: React.FC<Props> = () => {
  const [qrCodeData, setQrCodeData] = useState("");

  const generateQRCode = async (password: string) => {
    try {
      // get the private key
      const privateKey = await getPrivateKeyFromIndexedDB();
      if (privateKey) {
        // export private key(convert to base64 string).
        const privateKeyBase64 = await exportPrivateKey(privateKey);
        // encrypt private key using password
        const { encryptedData, iv, salt } = await encryptPrivateKey(
          password,
          privateKeyBase64
        );
        // saving key in the database
        const key = await addDeviceLinkKey(encryptedData, iv, salt);
        setQrCodeData(key);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <p className="text-muted-foreground text-lg">Link another device</p>
        <MonitorSmartphone size={100} strokeWidth={0.5} color="cyan" />
        <Button
          variant="outline"
          onClick={() => generateQRCode("12345")}
          className="w-full"
        >
          Generate QRcode
        </Button>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Link Device</DialogTitle>
            <DialogDescription>
              Scan QR code from mobile device you want to link and follow the
              process.
              <div className="flex flex-row items-center w-full p-2">
                <p className="flex items-center gap-2">
                  1. Open your <Smartphone color="cyan" /> Smart Phone.
                </p>
              </div>
              <div className="flex flex-row items-center w-full  p-2">
                <p className="flex items-center gap-2">
                  2. Click on <b>Getting Started</b> button on Home page.
                </p>
              </div>
              <div className="flex flex-row items-center w-full  p-2">
                <p className="flex items-center gap-2">
                  3. Select <b>Link Device</b> option.
                </p>
              </div>
              <div className="flex flex-row items-center w-full  p-2">
                <p className="flex items-center gap-2">
                  4. Click on <b>ScanQRcode</b> Button.
                </p>
              </div>
              <div className="flex flex-row items-center w-full  p-2">
                <p className="flex items-center gap-2">
                  5. Scan below QR code with the new device.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <QRCodeSVG
            className="mt-5"
            value={qrCodeData}
            size={256}
            fill="#FFFFFF"
            fgColor="#000000"
            title="Link device"
            marginSize={1}
          />
          <DialogFooter>
            <Button variant="outline" type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LinkDevice;
