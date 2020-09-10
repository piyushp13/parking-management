export class OrientationFixer {
  static arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  static resetOrientation(
    srcBase64: string,
    srcOrientation: number,
    maxSize: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      try {
        img.onload = () => {
          try {
            let width = img.width,
              height = img.height;
            let w = width,
              h = height;
            const canvas = document.createElement("canvas"),
              ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = false;

            if (width > h) {
              if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
              }
            }

            if (4 < srcOrientation && srcOrientation < 9) {
              w = height;
              h = width;
            }

            canvas.width = w;
            canvas.height = h;

            // transform context before drawing image
            switch (srcOrientation) {
              case 2:
                ctx.transform(-1, 0, 0, 1, width, 0);
                break;
              case 3:
                ctx.transform(-1, 0, 0, -1, width, height);
                break;
              case 4:
                ctx.transform(1, 0, 0, -1, 0, height);
                break;
              case 5:
                ctx.transform(0, 1, 1, 0, 0, 0);
                break;
              case 6:
                ctx.transform(0, 1, -1, 0, height, 0);
                break;
              case 7:
                ctx.transform(0, -1, -1, 0, height, width);
                break;
              case 8:
                ctx.transform(0, -1, 1, 0, 0, width);
                break;
              default:
                break;
            }

            // draw image
            ctx.drawImage(img, 0, 0, width, height);

            // export base64
            resolve(canvas.toDataURL("image/png"));
          } catch (error) {
            console.log("Error applying transform", error);
            reject(srcBase64);
          }
        };
        img.src = srcBase64;
      } catch (error) {
        console.log("Error loading image", error);
        reject(srcBase64);
      }
    });
  }

  static getOrientation(fileAsArrayBuffer: ArrayBuffer): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        const view = new DataView(fileAsArrayBuffer);

        if (view.getUint16(0, false) != 0xffd8) {
          resolve(-2);
        }

        const length = view.byteLength;
        let offset = 2;

        while (offset < length) {
          if (view.getUint16(offset + 2, false) <= 8) resolve(-1);
          let marker = view.getUint16(offset, false);
          offset += 2;

          if (marker == 0xffe1) {
            if (view.getUint32((offset += 2), false) != 0x45786966) {
              resolve(-1);
            }

            let little = view.getUint16((offset += 6), false) == 0x4949;
            offset += view.getUint32(offset + 4, little);
            let tags = view.getUint16(offset, little);
            offset += 2;
            for (let i = 0; i < tags; i++) {
              if (view.getUint16(offset + i * 12, little) == 0x0112) {
                resolve(view.getUint16(offset + i * 12 + 8, little));
              }
            }
          } else if ((marker & 0xff00) != 0xff00) {
            break;
          } else {
            offset += view.getUint16(offset, false);
          }
        }
        resolve(-1);
      } catch (error) {
        console.log("Error creating DataView from arraybuffer", error);
        reject(-1);
      }
    });
  }

  static async getCorrectlyOrientedImage(
    imageFile: File,
    maxSize: number = 1000
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const base64img =
          "data:" +
          imageFile.type +
          ";base64," +
          this.arrayBufferToBase64(e.target.result);
        // console.log("Started reading file", base64img);
        try {
          const orientation = await this.getOrientation(e.target.result);
          console.log("Orientation", orientation);
          const correctedImageDataUrl = await this.resetOrientation(
            base64img,
            orientation,
            maxSize
          );
          console.log("Corrected image", correctedImageDataUrl);
          resolve(correctedImageDataUrl);
        } catch (error) {
          console.log("Error fixing orientation", error);
          reject(base64img);
        }
      };
      reader.readAsArrayBuffer(imageFile);
    });
  }
}
