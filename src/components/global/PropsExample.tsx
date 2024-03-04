interface Props {
  movieTitle: String;
}

export default function MovieCard({ movieTitle }: Props) {
  return <h1>{movieTitle}</h1>;
}
