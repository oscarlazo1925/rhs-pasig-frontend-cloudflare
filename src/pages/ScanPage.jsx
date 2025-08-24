import { useEffect, useRef, useState } from "react";
import {
  Container,
  Card,
  Button,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import { Html5QrcodeScanner } from "html5-qrcode";
import toast from "react-hot-toast";
import axiosInstance from "../axiosInstance";

export default function ScanPage() {
  const inputRef = useRef(null);
  const [mode, setMode] = useState("keyboard"); // "keyboard" | "camera"
  const [value, setValue] = useState("");
  const [lastCode, setLastCode] = useState("");

  const timeoutRef = useRef(null);
  const scannerRef = useRef(null);

  const [error, setError] = useState("");
  const [scanResult, setScanResult] = useState(null); // ✅ holds user or "not found"
  const [isScanning, setIsScanning] = useState(false);

  // focus keyboard input when in keyboard mode
  useEffect(() => {
    if (mode === "keyboard" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  // Cleanup camera scanner when leaving camera mode
  useEffect(() => {
    if (mode === "camera") {
      if (!scannerRef.current) {
        scannerRef.current = new Html5QrcodeScanner("reader", {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        });

        scannerRef.current.render(
          (decodedText) => {
            setLastCode(decodedText);

          },
          (errorMessage) => {
            console.log("Scan error:", errorMessage);
          }
        );
      }
    }

    return () => {
      if (mode !== "camera" && scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [mode]);

  // Keyboard mode input change
  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (v.trim()) {
        setLastCode(v.trim());

        setValue("");
      }
    }, 200);
  };

  // Keyboard mode Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const code = value.trim();
      if (code) {
        setLastCode(code);

        setValue("");
      }
    }
  };

  const handleReadQr = async (qrCode) => {
    try {
      setIsScanning(true);
      setError("");
      setScanResult(null); // reset before new request

      const res = await axiosInstance.post("/users/scan-qr", { qrCode });
      if (res.data && res.data.data) {
        setIsScanning(false);
        setScanResult({ found: true, data: res.data.data });
      } else {
        setIsScanning(false);
        setScanResult({ found: false });
      }
    } catch (err) {
      setIsScanning(false);
      console.error(err);
      if (err.response) {
        setScanResult({ found: false });
        setError(err.response.data.message || "Error scanning QR");
      } else {
        setIsScanning(false);
        setError("Server unreachable");
      }
    }
  };

  useEffect(() => {
    if (!lastCode) return;

    // run after 500ms debounce
    const timer = setTimeout(() => {
      handleReadQr(lastCode);
    }, 500);

    // cleanup if lastCode changes before 500ms
    return () => clearTimeout(timer);
  }, [lastCode]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <Container
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center page-container"
      >
        <Card
          className="p-4 shadow-lg text-center"
          style={{ maxWidth: 480, width: "100%" }}
        >
          {scanResult && (
            <div className="row" style={{ minHeight: "150px" }}>
              {scanResult.found ? (
                <>
                  <h5>Alumni Found ✅</h5>
                  <div className="col-8 text-start">
                    <div>
                      <strong>Name:</strong> {scanResult.data.firstname}{" "}
                      {scanResult.data.lastname}
                    </div>
                    <div>
                      <strong>Email:</strong> {scanResult.data.email}
                    </div>
                    <div>
                      <strong>QR Code:</strong> {scanResult.data.qrCode}
                    </div>
                  </div>
                  <div className="col-4 text-center">
                    <div>
                      {" "}
                      <img
                        src={scanResult.data.photo}
                        alt="latest photo"
                        className="rounded-circle"
                        style={{
                          width: "75px",
                          height: "75px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <Alert variant="danger">
                  No data found for this QR code
                </Alert>
              )}
              <hr />
            </div>
          )}

          <h3 className="mb-3">QR / Barcode Scan</h3>

          {/* Toggle between modes */}
          <ToggleButtonGroup
            type="radio"
            name="scanner-mode"
            value={mode}
            onChange={setMode}
            className="mb-3"
          >
            <ToggleButton
              id="tbg-radio-1"
              value="keyboard"
              variant="outline-primary"
            >
              Keyboard Scanner
            </ToggleButton>
            <ToggleButton
              id="tbg-radio-2"
              value="camera"
              variant="outline-success"
            >
              Camera Scanner
            </ToggleButton>
          </ToggleButtonGroup>

          {mode === "keyboard" && (
            <div className="text-center">
              {/* Hidden input */}
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const code = e.target.value.trim();
                    if (code) {
                      setLastCode(code);

                      setValue("");
                    }
                  }
                }}
                className="scan-hidden-input"
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
              />

              {/* Tap to re-focus input */}
              <Button
                variant="primary"
                size="lg"
                className="my-3 w-75"
                onClick={() => inputRef.current?.focus()}
                disabled={isScanning}
              >
                {isScanning ? "Searching..." : "Tap to Scan (Keyboard)"}
              </Button>
            </div>
          )}

          {mode === "camera" && (
            <div id="reader" style={{ width: "100%", marginTop: "1rem" }}></div>
          )}

          {lastCode ? (
            <Alert
              variant="success"
              className="mt-3"
              onClick={() => handleReadQr(lastCode)}
            >
              <strong>Last code:</strong> {lastCode}
            </Alert>
          ) : (
            <Alert variant="secondary" className="mt-3">
              {mode === "camera"
                ? "Point camera at a QR code."
                : "Tap the button and scan a code."}
            </Alert>
          )}


        </Card>
      </Container>
    </>
  );
}
