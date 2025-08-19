import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { useNavigate, useParams } from "react-router-dom";
import SpeechToText from "./VoiceNote";
import RichTextEditor from "../components/RichTextEditor";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AddEditNotes = ({ type }) => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(type === "edit");

  const [auth] = useAuth();
  const userId = auth?.user?._id;
  const token = auth?.token;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async ()=>{
      if(type === "edit" && id){
        try{
          const res = await axios.get(`${BACKEND_URL}/notes/get-handwritten-note/${id}`);

          const note = res.data.note;
          setTitle(note.title);
          setContent(note.content);
        }
        catch(error){
          toast.error("Failed to load note")
        }
        finally{
          setLoading(false);
        }
      }
    };
    fetchNote();
  }, [type, id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Please enter the title");
    if (!content.trim()) return setError("Please enter the content");
    setError(null);

    const plainText = content.replace(/<[^>]*>/g, "");

    try {
      const url =
        type === "edit"
          ? `${BACKEND_URL}/notes/edit-note/${id}`
          : `${BACKEND_URL}/notes/add-note`;

      const method = type === "edit" ? "put" : "post";

      const { data } = await axios[method](
        url,
        { title, content: plainText, userId },
      );

      if (data?.note) {
        toast.success(
          type === "edit" ? "Note Updated Successfully" : "Note Added Successfully"
        );
        navigate("/ViewTextNotes");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-8 py-8">
      <div className="fixed top-[88px] left-4 z-40">
        <button
          onClick={() => navigate("/ViewTextNotes")}
          className="min-w-[120px] px-5 py-2 bg-gradient-to-r from-orange-500 to-blue-200 text-white rounded-full hover:opacity-90 transition-all duration-200 shadow-sm text-sm sm:text-base"
        >
          Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif mb-2 text-gray-900">
            {type === "edit" ? "Edit Note" : "Create a New Note"}
          </h1>
          <p className="text-gray-600">
            {type === "edit"
              ? "Modify your note content or title."
              : "Start a note and capture your thoughts clearly."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Note Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter a captivating title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Note Content
            </label>
            <RichTextEditor
              id="content"
              value={content}
              onChange={setContent}
              placeholder="Write the content of your note here..."
              className="min-h-[250px]"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button
              type="submit"
              className="w-full sm:w-1/2 px-6 py-3 bg-gradient-to-r from-orange-500 to-blue-400 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              {type === "edit" ? "Update Note" : "Add Note"}
            </button>

            <div className="w-full sm:w-1/2">
              <SpeechToText setContent={setContent} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditNotes;
