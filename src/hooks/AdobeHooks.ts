// @ts-nocheck
import { onCleanup } from "solid-js";

export const useAdobe = (url: string, fileName: string) => {
  let script = document.createElement("script");
  script.src = "https://documentservices.adobe.com/view-sdk/viewer.js";
  script.async = true;

  document.body.appendChild(script);

  const cb = async () => {
    try {
      let adobeDCView = new AdobeDC.View({
        clientId: `${
          import.meta.env.DEV
            ? import.meta.env.VITE_ADOBE_PDF_LOCAL
            : import.meta.env.VITE_ADOBE_PDF
        }`,
        divId: "character-sheet",
      });

      await adobeDCView.previewFile(
        {
          content: {
            location: {
              url,
            },
          },
          metaData: { fileName, enableFormFiling: false },
        },
        {
          embedMode: "FULL_WINDOW",
          defaultViewMode: "FIT_WIDTH",
          showAnnotationTools: false,
          showDownloadPDF: false,
        }
      );
    } catch (e: any) {
      console.log("IT FAILED");
    }
  };

  document.addEventListener("adobe_dc_view_sdk.ready", cb);

  onCleanup(() => {
    document.body.removeChild(script);
    document.removeEventListener("adobe_dc_view_sdk.ready", cb);
  });
};
