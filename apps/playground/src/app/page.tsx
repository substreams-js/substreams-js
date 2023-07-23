import { PackageCard } from "@/components/package-card";
import { Separator } from "@/components/ui/separator";
import { UploadPackage } from "@/components/upload-package";
import { featured } from "@/lib/featured";

export default function () {
  return (
    <div className="container w-full space-y-10 p-10 pb-16">
      <div>
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Upload a package</h2>
          <p className="text-muted-foreground">Upload one of your own substream packages.</p>
        </div>
        <Separator className="my-6" />
        <UploadPackage />
      </div>
      <div>
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Featured packages</h2>
          <p className="text-muted-foreground">Select a featured substream package from the list.</p>
        </div>
        <Separator className="my-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <PackageCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
