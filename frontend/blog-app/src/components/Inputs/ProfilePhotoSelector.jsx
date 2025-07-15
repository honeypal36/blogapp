import React from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({image, setImage, preview, setPreview}) => {
    const inputRef=useRef(null);
    const [previewUrl, setPreviewUrl]=useState(null);

    const handleImageChange = (event) =>{
        const file=event.target.files[0];
        if(file){
            //update image state
            setImage(file);

            //generate preview URL from the file
            const preview=URL.createObjectURL(file);
            if(setPreview){
                setPreview(preview)
            }
            setPreviewUrl(preview);
        }
    };

    const handleRemoveImage=()=>{
        setImage(null);
        setPreviewUrl(null);

        if(setPreview){
            setPreview(null)
        }
    };

    const onChooseFile=()=>{
        inputRef.current.click();
    };
  return (
    <div className=''>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className=''
      />

      {!image}
    </div>
  )
}

export default ProfilePhotoSelector
