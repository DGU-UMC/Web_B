interface TagProps {
  name: string;
  id: number;
  onDelete: (id: number) => void;
}

const TagCard = ({ name, id, onDelete }: TagProps) => {
  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className="flex space-x-2 py-1 px-2 items-center justify-center border border-gray-950 rounded-lg">
      <span>{name}</span>
      <button onClick={handleDelete} className="cursor-pointer">
        x
      </button>
    </div>
  );
};

export default TagCard;
