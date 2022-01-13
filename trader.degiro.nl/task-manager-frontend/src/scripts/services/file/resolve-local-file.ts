export default function resolveLocalFile(fileUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(fileUrl, (entry: Entry) => {
            (entry as FileEntry).file((file: Blob) => {
                const reader = new FileReader();

                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(file);
            });
        });
    });
}
