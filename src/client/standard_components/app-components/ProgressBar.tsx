/** Returns a progress bar component with a given percentage completed.
  {
    bgcolor: <String>,
    completed: <Number>,
    display: <String>,
    id: <String>,
  }
  @returns
  {
    ProgressBar: <Component>
  }
 */

type Args = {
  bgcolor: string;
  completed: number;
  display: string;
  id: string;
};

const ProgressBar = ({ bgcolor, completed, display, id }: Args) => {
  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: '#0b179c',
    borderRadius: 50,
  };

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
  };

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
    width: '100%',
  };

  return (
    <div style={containerStyles} id={id}>
      <div style={fillerStyles}>
        <div style={{ position: 'absolute' }}>
          <span style={labelStyles}>{`${display}`}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
