import { type Package, createSubstream } from "@fubhy/substreams";
import { Callout, Card, Title } from "@tremor/react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ExclamationIcon } from "@heroicons/react/solid";

export function UploadDropzone({
  setUploaded,
  className,
}: {
  className?: string;
  setUploaded: (substream: Package) => void;
}) {
  const [error, setError] = useState<string | undefined>(undefined);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/octet-stream": [".spkg"],
    },
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onerror = () => {
          setError("Failed to read the file");
        };

        reader.onload = () => {
          try {
            if (reader.result instanceof ArrayBuffer) {
              setUploaded(createSubstream(reader.result));
              setError(undefined);
            } else {
              throw new Error("Expected `ArrayBuffer` from `FileReader`");
            }
          } catch (error) {
            console.error(error);
            setError("Failed to process the file");
          }
        };

        reader.readAsArrayBuffer(file);
      });
    },
  });

  return (
    <>
      <Card className={className} {...getRootProps()}>
        <input {...getInputProps()} />
        <Title className="text-center text-lg p-10">
          Drag 'n' drop a substream package (.spkg) file here, or click to select one
        </Title>

        {error ? (
          <Callout className="mt-4" title="An error occurred" icon={ExclamationIcon} color="rose">
            {error}
          </Callout>
        ) : null}
      </Card>
    </>
  );
}
