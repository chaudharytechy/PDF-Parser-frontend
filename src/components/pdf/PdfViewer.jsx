import React from 'react'
import { FileWarning } from 'lucide-react'

// // Renders the actual PDF using the browser's native viewer via an iframe/object tag.
// export default function PdfViewer({ url, height = '600vh' }) {
//   if (!url) {
//     return (
//       <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 bg-white py-16 text-ink-400">
//         <FileWarning size={26} />
//         <p className="text-sm">No PDF selected to preview</p>
//       </div>
//     )
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
//       <object data={url} type="application/pdf" width="100%" height={height}>
//         <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-400">
//           <FileWarning size={26} />
//           <p className="text-sm">
//             Preview isn't supported in this browser. <a className="text-brand-600 underline" href={url} target="_blank" rel="noreferrer">Open the file instead</a>.
//           </p>
//         </div>
//       </object>
//     </div>
//   )
// }
// import { FileWarning } from "lucide-react";

// Renders the PDF using the browser's native PDF viewer.
export default function PdfViewer({ url, height = "500px" }) {
  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 bg-white py-16 text-ink-400">
        <FileWarning size={26} />
        <p className="text-sm">No PDF selected to preview</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-[60%] overflow-hidden rounded-xl border border-ink-200 bg-white">
        <object
          data={url}
          type="application/pdf"
          width="100%"
          height={height}
        >
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-400">
            <FileWarning size={26} />

            <p className="text-sm">
              Preview isn't supported in this browser.{" "}
              <a
                className="text-brand-600 underline"
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                Open the file instead
              </a>
              .
            </p>
          </div>
        </object>
      </div>
    </div>
  );
}