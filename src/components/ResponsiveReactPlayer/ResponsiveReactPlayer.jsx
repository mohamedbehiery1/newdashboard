import  {makeStyles}  from "@material-ui/styles";
import ReactPlayer from "react-player";

const useStyles = makeStyles((theme) => ({
  playerWrapper: {
    position: "relative",
    paddingTop: "13%", // Only audio files
  },

  reactPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
}));

export default ({ url, ...rest }) => {
  const classes = useStyles(rest);
  return (
    <div className={classes.playerWrapper}>
      <ReactPlayer
        className={classes.reactPlayer}
        url={url}
        width='100%'
        height='100%'
        {...rest}
      />
    </div>
  );
};
