"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { createSubstream } from "@substreams/core";
import { Package } from "@substreams/core/proto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

export function UploadPackage() {
  const client = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    // TODO: Upload to a server somewhere.
    mutationFn: async (pkg: Package) => pkg,
    onMutate: (pkg) => {
      client.setQueryData(["substream", "uploaded"], () => pkg);
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/octet-stream": [".spkg"],
    },
    onDrop: (acceptedFiles) => {
      for (const file of acceptedFiles) {
        const reader = new FileReader();

        reader.onload = () => {
          try {
            if (reader.result instanceof ArrayBuffer) {
              const pkg = createSubstream(reader.result);

              mutation.mutate(pkg);
              router.push("/uploaded");
            } else {
              throw new Error("Expected `ArrayBuffer` from `FileReader`");
            }
          } catch (error) {
            console.error(error);
          }
        };

        reader.readAsArrayBuffer(file);
      }
    },
  });

  return (
    <Card className="bg-accent text-center cursor-pointer p-6" {...getRootProps()}>
      <input {...getInputProps()} />
      <CardHeader>
        <CardTitle>Drag 'n' drop a substream package here or click to select one</CardTitle>
      </CardHeader>
    </Card>
  );
}
