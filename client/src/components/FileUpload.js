import { useState } from "react"
import axios from "axios";
import "./FileUpload.css"
const FileUpload = ({contract,account,provider}) => {

/* 
PINATA_API_KEY="95ff357aa876ac13a20c"
PINATA_API_SECRET_KEY="669bf3bc22c5936a23a5a04c32c25a573fd5c0189d506b44dc16a38678294480"

*/

    const [file,setFile] = useState(null);
    const [fileName,setFileName] = useState("No Image selected");
    const handleSubmit = async(e) => {
        e.preventDefault();
        if(file){
            try {
                const formData = new FormData();
                formData.append("file",file);

                const resFile = await axios({
                    method: "post",
                    url:"https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data:formData,
                    headers:{
                        pinata_api_key:`95ff357aa876ac13a20c`,
                        pinata_secret_api_key:`669bf3bc22c5936a23a5a04c32c25a573fd5c0189d506b44dc16a38678294480`,
                        "Content-Type":"multipart/form-data",
                    },
                });
                const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                // const signer = contract.connect(provider.getSigner());
                contract.add(account,ImgHash);
                alert("Successfully Image Uploaded");
                setFileName("No Image selected");
                setFile(null);

            } catch (error) {
                alert("unable to upload to Pinanta");
            }
        }
    }

    const retrieveFile = (e) => {
        const data = e.target.files[0];
        console.log(data);
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data)
        reader.onloadend = () => {
            setFile(e.target.files[0]);
        }
        setFileName(e.target.files[0].name);
        e.preventDefault();
    };

    return (
        <div className="top">
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="file-upload" className="choose">
              Choose Image
            </label>
            <input
              disabled={!account}
              type="file"
              id="file-upload"
              name="data"
              onChange={retrieveFile}
            />
            <span className="textArea">Image: {fileName}</span>
            <button type="submit" className="upload" disabled={!file}>
              Upload File
            </button>
          </form>
        </div>
      );
}

export default FileUpload