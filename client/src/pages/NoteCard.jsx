import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import DOMPurify from 'dompurify';

const NoteCard = ({ id, title, date, content, onDelete, onClick }) => {
  const navigate = useNavigate();

  return (
    <div
      className="note-card h-60 shadow-md transition-all relative"
      onClick={() => onClick?.({ id, title, date, content })}
    >
      <div className="p-6 h-full flex flex-col justify-between">
        <div className="cursor-pointer flex-1 group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold line-clamp-1 group-hover:text-blue-800">
              {title}
            </h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {moment(date).format('Do MMM YYYY')}
            </span>
          </div>

          <div
            className="text-gray-600 mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
          />
        </div>

        <div className="flex justify-between items-center gap-2 text-sm text-gray-500">
          <span
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/notes/edit/${id}`);
            }}
            className="cursor-pointer px-2 py-1 bg-orange-600 text-white text-xs rounded-full hover:bg-orange-800 transition-colors"
          >
            Edit Note
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(id);
            }}
            className="cursor-pointer px-2 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-800 transition-colors"
          >
            Delete Note
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
