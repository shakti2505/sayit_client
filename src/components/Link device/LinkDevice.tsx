import React, { useState } from "react";
import { MonitorSmartphone, Smartphone, Check } from "lucide-react";
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

import ToolTipInfo from "../common/TooltipInfo";
import { createPasswordAuth, verifyPassword } from "../auth/authServices";

interface Props {
  // define your props here
}

const LinkDevice: React.FC<Props> = () => {
  const [qrCodeData, setQrCodeData] = useState("");
  const [isGenerateQRcode, setIsGenerateQRcode] = useState(false);
  const [iSCreatePassword, setIsCreatepassword] = useState(false);
  const [createPassword, setCreatepassword] = useState("");
  const [password, setPassword] = useState("");

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleCreatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreatepassword(e.target.value);
  };

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

  const verifyPasswordAndGenerateQrCode = async () => {
    const isPasswordVerified = await verifyPassword(password);
    if (isPasswordVerified === "Password verified Successfully") {
      await generateQRCode(password);
      setIsGenerateQRcode(false);
    }
  };

  if (!iSCreatePassword) {
    return (
      <>
        <div className="flex flex-col justify-center items-center">
          <p className="text-muted-foreground text-lg">Link another device</p>
          <MonitorSmartphone size={100} strokeWidth={0.5} color="cyan" />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsGenerateQRcode(true)}
              className="w-full text-muted-foreground"
              variant="outline"
            >
              Generate QrCode
            </Button>
          </DialogTrigger>
          <DialogContent
            className="w-full"
            onInteractOutside={(e) => e.preventDefault()}
          >
            {isGenerateQRcode ? (
              <div className="flex flex-col bg-background border-none mt-2 gap-2 p-2 ">
                <div className="flex flex-row items-center bg-background border-none w-full rounded-lg gap-2 py-2">
                  <input
                    type="password"
                    autoFocus
                    id="message"
                    placeholder="Enter password"
                    className="w-full outline-none text-muted-foreground bg-background p-1 text-base border-b-2"
                    autoComplete="off"
                    onChange={handlePassword}
                    // onKeyDown={(e) => {
                    //   if (e.key === "Enter" && message.trim().length > 0) {
                    //     e.preventDefault(); // Prevents unintended behavior like newline in textarea
                    //     handleSubmit(e); // Calls the submit function
                    //   }
                    // }}
                  />
                  {password.length > 0 ? (
                    <button
                      onClick={verifyPasswordAndGenerateQrCode}
                      className="bg text-muted-foreground hover:cursor-pointer drop-shadow-md rounded-md p-1 active:scale-75"
                    >
                      <Check />
                    </button>
                  ) : (
                    <ToolTipInfo content="Enter Password to generate QR code" />
                  )}
                </div>
                <p className="text-xs">
                  Haven't set a password yet? Click here to{" "}
                  <button
                    onClick={() => setIsCreatepassword(true)}
                    className="text-cyan-400 underline hover:cursor-pointer"
                  >
                    create one now
                  </button>
                  .
                </p>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Link Device</DialogTitle>
                  <DialogDescription>
                    Scan QR code from mobile device you want to link and follow
                    the process.
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
              </>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  } else {
    return (
      <Dialog open={iSCreatePassword} onOpenChange={setIsCreatepassword}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Create password</DialogTitle>
            <DialogDescription>
              Create password if have not create one yet.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row items-center bg-background border-none w-full rounded-lg gap-2 py-2">
            <input
              type="password"
              value={createPassword}
              autoFocus
              id="message"
              placeholder="Enter password"
              className="w-full outline-none text-muted-foreground bg-background p-1 text-base border-b-2"
              autoComplete="off"
              onChange={handleCreatePassword}
              // onKeyDown={(e) => {
              //   if (e.key === "Enter" && message.trim().length > 0) {
              //     e.preventDefault(); // Prevents unintended behavior like newline in textarea
              //     handleSubmit(e); // Calls the submit function
              //   }
              // }}
            />
            {createPassword.length > 0 ? (
              <button
                onClick={() => createPasswordAuth(password)}
                className="bg text-muted-foreground hover:cursor-pointer drop-shadow-md rounded-md p-1 active:scale-75"
              >
                <Check />
              </button>
            ) : (
              <ToolTipInfo content="Create Password" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
};

export default LinkDevice;
