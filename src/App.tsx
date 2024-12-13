import './App.css'
import { AiOutlineSelect,AiOutlineScan  } from "react-icons/ai"; 

function App() {
  const extractAllText = () => {
    chrome.runtime.sendMessage(
      { action: "extractAll" },
      (response) => {
        if (response?.success) {
          // Handle the extracted text directly if needed
          alert("Text extraction successful!"+response);
        } else {
          alert("Failed to extract text: " + response?.error);
        }
      }
    );
  };
  const extractSelectedText = () => {
    chrome.runtime.sendMessage(
      { action: "extractSelected" },
      (response) => {
        if (response?.success) {
          alert("Selected text extraction successful!" + response.text);
          console.log(response.text);
        } else {
          alert("Failed to extract selected text: " + response?.error);
        }
      }
    );
  };

  return (
    <div className='bg-[#f6f6f6] w-80 flex flex-col pt-5 p-1 gap-5'>
      
      <div className='flex flex-col gap-1'>
        <button  
        onClick={extractSelectedText}
        className='w-full text-[#3d3d3d]  text-left py-2 text-base px-3 flex items-center gap-2 hover:bg-white'>
         <AiOutlineScan  style={{width: '20px', height: '20px'}}/>
          Extract Selected Text
        </button>
        <button 
          onClick={extractAllText}
         className='w-full text-[#3d3d3d]  text-left py-2 text-base px-3 flex items-center gap-2 hover:bg-white'>
          <AiOutlineSelect  style={{width: '20px', height: '20px'}}/>
          Extract All Text
        </button>
        
      </div>
      
    </div>
  )
}

export default App
