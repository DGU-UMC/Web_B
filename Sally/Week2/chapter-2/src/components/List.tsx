export type Tech =
  | "REACT"
  | "NEXT"
  | "VUE"
  | "SVELTE"
  | "ANGULAR"
  | "REACT-NATIVE";

interface ListProps {
  tech: Tech;
}

const List = ({ tech }: ListProps) => {
  return <li>{tech}</li>;
};

export default List;
