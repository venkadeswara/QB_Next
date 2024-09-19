import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../components/ThemeContext";
 
const SpinnerTest = () => {
  const { color,isDarkMode} = useTheme();

  return (
    <div className="flex items-center justify-center h-screen z-10">
       <FontAwesomeIcon icon={faSpinner} className="w-10 h-10 animate-spin z-10 "style={{ color: isDarkMode ? 'white' : color}} />
    </div>
  );
};
 
export default SpinnerTest;