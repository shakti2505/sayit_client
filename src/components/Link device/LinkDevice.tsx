import React, { useState } from "react";
import { MonitorSmartphone } from "lucide-react";
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
        // export private key(convert to base64 string)
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
        <Button onClick={() => generateQRCode("12345")} className="w-full">
          Link Device
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
              Scan QR code to Link the device
            </DialogDescription>
          </DialogHeader>
          <QRCodeSVG className="mt-5 p-2" value={qrCodeData} size={256} />
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LinkDevice;
