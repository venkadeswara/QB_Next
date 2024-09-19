import React from 'react';
import { useTheme } from './ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
 
export const CustomUploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg"  width="20" height="20"  viewBox="0 0 24 24">
      <path d="M21.5 24h-19A2.503 2.503 0 0 1 0 21.5v-5a.5.5 0 0 1 1 0v5c0 .827.673 1.5 1.5 1.5h19c.827 0 1.5-.673 1.5-1.5v-5a.5.5 0 0 1 1 0v5c0 1.378-1.121 2.5-2.5 2.5z" stroke="currentColor" 
      strokeWidth="1.5"/>
      <path d="M12 17a.5.5 0 0 1-.5-.5V.5a.5.5 0 0 1 1 0v16a.5.5 0 0 1-.5.5z" stroke="currentColor" 
      strokeWidth="1.5"/>
      <path d="M16 5a.502.502 0 0 1-.354-.146L12 1.207 8.354 4.854a.5.5 0 0 1-.707-.707l4-4a.5.5 0 0 1 .707 0l4 4A.5.5 0 0 1 16 5z"  stroke="currentColor" 
      strokeWidth="1.5"/>
    </svg>
  );

  interface PlayIconProps {
    isIndiClick: boolean;
  }

export const PlayIcon: React.FC<PlayIconProps> = ({ isIndiClick }) => {
  const { isDarkMode } = useTheme();

  return isIndiClick ? (
    <FontAwesomeIcon
      icon={faSpinner}
      spin
      className={isDarkMode ? 'text-white' : 'text-[#587d90]'}
    />
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" >
    <path  d="M4.771 1.555a.5.5 0 0 1 .52.038l14 10a.5.5 0 0 1-.01.82l-14 9.5a.5.5 0 0 1-.78-.413V2a.5.5 0 0 1 .27-.445ZM5.5 2.972v17.585l12.625-8.567L5.5 2.971Z"
      stroke={isDarkMode ? "#FFFFFF" : "#587d90"}
      strokeWidth={isDarkMode ? "1.5" : "1"}/>
      </svg>
  );
};

export const ScheduleIcon: React.FC = () => {
  const { isDarkMode } = useTheme();
  return(
  <svg xmlns="http://www.w3.org/2000/svg"  width="16" height="16" viewBox="0 0 24 24">
  <path d="M21.5 24h-19A2.503 2.503 0 0 1 0 21.5v-17C0 3.122 1.122 2 2.5 2h19C22.878 2 24 3.122 24 4.5v17c0 1.378-1.122 2.5-2.5 2.5zM2.5 3C1.673 3 1 3.673 1 4.5v17c0 .827.673 1.5 1.5 1.5h19c.827 0 1.5-.673 1.5-1.5v-17c0-.827-.673-1.5-1.5-1.5h-19z"
    stroke={isDarkMode ? "#FFFFFF" : "#74808c"}
    strokeWidth={isDarkMode ? "1.5" : "1"}/>
    <path d="M23.5 9H.5a.5.5 0 0 1 0-1h23a.5.5 0 0 1 0 1zM5.5 5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 1 0v4a.5.5 0 0 1-.5.5zM18.5 5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 1 0v4a.5.5 0 0 1-.5.5z"
    stroke={isDarkMode ? "#FFFFFF" : "#74808c"}
    strokeWidth={isDarkMode ? "1.5" : "1"}/>
    </svg>);};
  

  interface DeleteIconProps extends React.SVGProps<SVGSVGElement> {}
  
  export const DeleteIcon: React.FC<DeleteIconProps> = (props) => {
    const { isDarkMode } = useTheme();
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        className={props.className} 
        {...props} 
      >
        <path
          id="d"
          d="M9.5 8.5A.5.5 0 0 0 9 9v8a.5.5 0 0 0 1 0V9a.5.5 0 0 0-.5-.5Z"
          stroke={isDarkMode ? "#FFFFFF" : "#cd9898"}
          strokeWidth={isDarkMode ? "1.5" : "1"}
        />
        <path
          d="M14.5 8.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V9a.5.5 0 0 1 .5-.5Z"
          stroke={isDarkMode ? "#FFFFFF" : "#cd9898"}
          strokeWidth={isDarkMode ? "1.5" : "1"}
        />
        <path
          id="e"
          d="M7.1 5.301a.5.5 0 0 0 .4.199H17a.5.5 0 0 0 .48-.637l-.585-2.05A2.5 2.5 0 0 0 14.491 1H10.01a2.5 2.5 0 0 0-2.404 1.813l-.586 2.05a.5.5 0 0 0 .082.438ZM8.164 4.5l.403-1.412A1.5 1.5 0 0 1 10.01 2h4.482a1.5 1.5 0 0 1 1.443 1.088l.403 1.412H8.163Z"
          stroke={isDarkMode ? "#FFFFFF" : "#cd9898"}
          strokeWidth={isDarkMode ? "1.5" : "1"}
        />
        <path
          d="M4.95 7.003a.5.5 0 0 1 .548.447l1.32 13.2A1.5 1.5 0 0 0 8.31 22h7.38a1.5 1.5 0 0 0 1.493-1.35l1.32-13.2a.5.5 0 0 1 .995.1l-1.32 13.199A2.5 2.5 0 0 1 15.69 23H8.31a2.5 2.5 0 0 1-2.488-2.251l-1.32-13.2a.5.5 0 0 1 .448-.546Z"
          stroke={isDarkMode ? "#FFFFFF" : "#cd9898"}
          strokeWidth={isDarkMode ? "1.5" : "1"}
        />
        <path
          id="b"
          d="M3 5a.5.5 0 0 1 .5-.5h17a.5.5 0 0 1 0 1h-17A.5.5 0 0 1 3 5Z"
          stroke={isDarkMode ? "#FFFFFF" : "#cd9898"}
          strokeWidth={isDarkMode ? "1.5" : "1"}
        />
      </svg>
    );
  };
  


interface FilterIconProps extends React.SVGProps<SVGSVGElement> {
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}
export const FilterIcon: React.FC<FilterIconProps> = ({ onClick, className, ...props }) => {
  const { isDarkMode } = useTheme();
  return(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    className={className}
    onClick={onClick}
    {...props}
     >
    <path d="M9.5 24a.5.5 0 0 1-.5-.5V13.398a1.5 1.5 0 0 0-.504-1.121L.838 5.474A2.503 2.503 0 0 1 0 3.6V1.5C0 .673.673 0 1.5 0h21c.827 0 1.5.673 1.5 1.5v2.1c0 .719-.306 1.403-.839 1.875l-7.657 6.803c-.32.284-.504.692-.504 1.12v6.535c0 .523-.278 1.016-.728 1.286l-4.516 2.709A.488.488 0 0 1 9.5 24zm-8-23a.5.5 0 0 0-.5.5v2.1c0 .433.183.844.501 1.125l7.659 6.804c.533.474.84 1.155.84 1.869v9.219l3.758-2.254a.505.505 0 0 0 .242-.429v-6.535c0-.714.307-1.396.84-1.869l7.658-6.803c.319-.283.502-.694.502-1.127V1.5a.5.5 0 0 0-.5-.5h-21z"
    stroke={isDarkMode ? "#FFFFFF" : "#7f848a"}
    strokeWidth={isDarkMode ? "1.5" : "1"}
    />
  </svg>
);

};

interface SaveIconProps extends React.SVGProps<SVGSVGElement> {}

export const SaveIcon: React.FC<SaveIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    className={props.className} 
    {...props}
  >
    <path
      fill="#b9cbba"
      d="M24 5.018a2 2 0 0 0-.586-1.414L20.396.586A1.999 1.999 0 0 0 18.982 0H2.75A2.75 2.75 0 0 0 0 2.75v18.5A2.75 2.75 0 0 0 2.75 24h18.5A2.75 2.75 0 0 0 24 21.25z"
    />
    <path
      fill="#ffffff"
      d="M4 6.25v-2.5A.75.75 0 0 1 4.75 3h10.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75H4.75A.75.75 0 0 1 4 6.25z"
    />
    <circle
      cx="12"
      cy="15.5"
      r="4.5"
      fill="#ffffff"
    />
  </svg>
);

interface PlusIconProps {
  className?: string;
}
 
export const PlusIcon: React.FC<PlusIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    className={className}
  >
    
    <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" />
  </svg>
);


export const MinusIcon: React.FC = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
<path d="M21.25 12.75H2.75a.75.75 0 0 1 0-1.5h18.5a.75.75 0 0 1 0 1.5z"
stroke="#cd9898"
strokeWidth="2"/>
</svg>
);




interface CancelIconProps extends React.SVGProps<SVGSVGElement> {}
export const CancelIcon: React.FC<CancelIconProps> = (props) => {
  const { isDarkMode } = useTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="18"
      viewBox="0 0 24 24"
      stroke={isDarkMode ? "#FFFFFF" : "#a6a6a4"}
      strokeWidth="3"
      fill="none"
      className={`text-current ${props.className || ''}`} 
      {...props} 
    >
      <circle cx="12" cy="12" r="11" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  );
};

export const ModifyIcon: React.FC = () => {
  const {isDarkMode}=useTheme()
  return(
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
  <path d="M17.5 24h-15A2.503 2.503 0 0 1 0 21.5v-15C0 5.122 1.121 4 2.5 4h9a.5.5 0 0 1 0 1h-9C1.673 5 1 5.673 1 6.5v15c0 .827.673 1.5 1.5 1.5h15c.827 0 1.5-.673 1.5-1.5v-9a.5.5 0 0 1 1 0v9c0 1.378-1.121 2.5-2.5 2.5z"
  stroke={isDarkMode ? "#FFFFFF" : "#587d90"}
  strokeWidth={isDarkMode ? "1.5" : "1"}/>
  <path d="M8.772 15.728a.5.5 0 0 1-.491-.598l.707-3.536a.491.491 0 0 1 .137-.255L19.732.732A2.502 2.502 0 0 1 24 2.5c0 .668-.26 1.296-.732 1.768L12.661 14.875a.497.497 0 0 1-.256.137l-3.535.706a.46.46 0 0 1-.098.01zm1.168-3.789-.53 2.652 2.651-.53 10.499-10.5c.284-.284.44-.66.44-1.061s-.156-.777-.439-1.061a1.501 1.501 0 0 0-2.121 0l-10.5 10.5zm2.368 2.582h.01-.01z"
  stroke={isDarkMode ? "#FFFFFF" : "#587d90"}
  strokeWidth={isDarkMode ? "1.5" : "1"}/>
  <path d="M21.5 5.829a.502.502 0 0 1-.354-.146l-2.828-2.829a.5.5 0 0 1 .707-.707l2.828 2.829a.5.5 0 0 1-.353.853z"
  stroke={isDarkMode ? "#FFFFFF" : "#587d90"}
  strokeWidth={isDarkMode ? "1.5" : "1"}/></svg>
  );};
 
 
  export const DownloadIcon: React.FC = () => {
    const {isDarkMode}=useTheme()
    return(
<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><g >
  <path d="M13 5.5a5.5 5.5 0 0 0-5.49 5.16.5.5 0 0 1-.625.453A3.5 3.5 0 1 0 6 18h12a4 4 0 0 0 .738-7.932.5.5 0 0 1-.394-.373A5.502 5.502 0 0 0 13 5.5Zm-6.429 4.536a6.501 6.501 0 0 1 12.663-.882A5.002 5.002 0 0 1 18 19H6a4.5 4.5 0 1 1 .571-8.964Z"
  stroke={isDarkMode ? "#FFFFFF" : "#587d90"}
  strokeWidth="1"/>
  <path d="M13 16a.5.5 0 0 1-.5-.5v-6a.5.5 0 0 1 1 0v6a.5.5 0 0 1-.5.5Z"
  stroke={isDarkMode ? "#FFFFFF" : "#587d90"}
  strokeWidth="1"/>
  <path d="M13.354 15.854a.5.5 0 0 1-.708 0l-2.5-2.5a.5.5 0 0 1 .708-.708L13 14.793l2.146-2.147a.5.5 0 0 1 .708.708l-2.5 2.5Z"
  stroke={isDarkMode ? "#FFFFFF" : "#587d90"}
  strokeWidth="1"/></g>
</svg>);};

export const CreateIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"  viewBox="0 0 24 24">
  <path d="M21.25 12.75H2.75a.75.75 0 0 1 0-1.5h18.5a.75.75 0 0 1 0 1.5z"
  stroke="#8ab58c"
  strokeWidth="2"/>
  <path d="M12 22a.75.75 0 0 1-.75-.75V2.75a.75.75 0 0 1 1.5 0v18.5A.75.75 0 0 1 12 22z"
  stroke="#8ab58c"
  strokeWidth="2"/>
  </svg>);

export const EmailIcon: React.FC = () => {
  const {isDarkMode}=useTheme()
  return(
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
  <path d="M22 20H2c-1.103 0-2-.897-2-2V6c0-1.103.897-2 2-2h20c1.103 0 2 .897 2 2v12c0 1.103-.897 2-2 2zM2 5c-.551 0-1 .449-1 1v12c0 .551.449 1 1 1h20c.551 0 1-.449 1-1V6c0-.551-.449-1-1-1z" stroke= {isDarkMode ? "#FFFFFF" : ""}/>
  <path d="M12 13.744c-.397 0-.794-.094-1.157-.283L.269 7.943a.501.501 0 0 1 .463-.887l10.575 5.517a1.5 1.5 0 0 0 1.388 0L23.27 7.056a.5.5 0 1 1 .463.887L13.157 13.46c-.363.189-.76.284-1.157.284z" stroke= {isDarkMode ? "#FFFFFF" : ""}/>
  </svg>);};



interface PasswordIconProps extends React.SVGProps<SVGSVGElement> {}
export const PasswordIcon: React.FC<PasswordIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-current" 
    {...props} 
  >
   <path d="M4.51 24.01H.49a.5.5 0 0 1-.5-.5v-4.54c0-.133.053-.26.146-.354l7.332-7.332A8.337 8.337 0 0 1 7 8.5C7 3.818 10.813.01 15.5.01c4.682 0 8.49 3.809 8.49 8.49 0 4.687-3.809 8.5-8.49 8.5a8.34 8.34 0 0 1-3.178-.616l-3.469 3.461a.502.502 0 0 1-.353.145H7v1.5a.5.5 0 0 1-.5.5H5.01v1.52a.5.5 0 0 1-.5.5zm-3.52-1h3.02v-1.52a.5.5 0 0 1 .5-.5H6v-1.5a.5.5 0 0 1 .5-.5h1.793l3.563-3.555a.502.502 0 0 1 .562-.1A7.323 7.323 0 0 0 15.5 16c4.13 0 7.49-3.364 7.49-7.5 0-4.13-3.36-7.49-7.49-7.49C11.364 1.01 8 4.37 8 8.5c0 .954.173 1.871.514 2.725a.5.5 0 0 1-.111.539L.99 19.177v3.833z"/>
   <circle cx="14" cy="8" r="2" stroke="currentColor" fill="white" />
   
</svg>
);

interface LogoutIconProps extends React.SVGProps<SVGSVGElement> {}

export const LogoutIcon: React.FC<LogoutIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-current" 
    {...props}
  >
   <path d="M12 24C5.935 24 1 19.065 1 13 1 8.345 3.947 4.177 8.333 2.628a.5.5 0 0 1 .333.943A10.013 10.013 0 0 0 2 13c0 5.514 4.486 10 10 10s10-4.486 10-10a10.01 10.01 0 0 0-6.667-9.428.5.5 0 0 1 .333-.943A11.012 11.012 0 0 1 23 13c0 6.065-4.935 11-11 11z"
   />
   <path d="M12 8a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 1 0v7a.5.5 0 0 1-.5.5z"
   /></svg>
);

interface AboutIconProps extends React.SVGProps<SVGSVGElement> {}

export const AboutIcon: React.FC<AboutIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor" 
    className="text-current" 
    {...props}
  >
    <path d="M12 24C5.383 24 0 18.617 0 12S5.383 0 12 0s12 5.383 12 12-5.383 12-12 12zm0-23C5.935 1 1 5.935 1 12s4.935 11 11 11 11-4.935 11-11S18.065 1 12 1z"/>
    <path d="M12 8c-.827 0-1.5-.673-1.5-1.5S11.173 5 12 5s1.5.673 1.5 1.5S12.827 8 12 8zm0-2a.5.5 0 1 0 .002 1.002A.5.5 0 0 0 12 6zM12 18a.5.5 0 0 1-.5-.5V11h-1a.5.5 0 0 1 0-1H12a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5z"/>
    <path d="M14 18h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z"/>
  </svg>
);

interface PrivateIconProps extends React.SVGProps<SVGSVGElement> {
  isActive: boolean;
}
export const PrivateIcon: React.FC<PrivateIconProps> = ({ isActive, ...props }) => {
  const {isDarkMode}=useTheme();
  return(
 <svg
   xmlns="http://www.w3.org/2000/svg"
   width="16"
   height="20"
   viewBox="0 0 26 23"
   {...props}
   className={`transition-all duration-300 ease-in-out cursor-pointer ${isActive ? 'fill-current text-gray-600' : 'fill-none text-gray-500'}`}
   >
     <rect
       x="4"
       y="8"
       width="20"
       height="15.5"
       rx="4"
       stroke={isDarkMode ? "#FFFFFF" : "#7f848a"}
       strokeWidth="2" 
       style={{ color: isDarkMode ? "#FFFFFF" : undefined }} 
       fill={isActive ? 'currentColor' : 'none'}
     />
 <path d="M22 8 A7 6 0 0 0 6 8"
     width="24"
     height="30"
     fill="none"
     stroke={isDarkMode ? "#FFFFFF" : "#7f848a"}
     strokeWidth="2">
 </path>
 </svg>
);
};
interface PublicIconProps extends React.SVGProps<SVGSVGElement> {
  isActive: boolean;
}
export const PublicIcon: React.FC<PublicIconProps> = ({ isActive, ...props }) => {
  const {isDarkMode}=useTheme();
  return(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 16"
				   
    {...props}
    className={`mb-2 cursor-pointer transition-all duration-300 ease-in-out ${isActive ? 'text-gray-600 fill-current' : 'text-gray-500 fill-none'}`}
    stroke={isActive ? 'none' : 'currentColor'}
    style={{ color: isDarkMode ? "#FFFFFF" : undefined }}
    strokeWidth={isActive ? 'none' : '1'}
  >
    {isActive ? (
      <>
        <circle cx="4" cy="10" r="2" />
        <path d="M6.67 13.4A4.19 4.19 0 0 0 5 16.75V17H.75c-.41 0-.75-.34-.75-.75v-.5C0 14.23 1.23 13 2.75 13h2.5c.52 0 1.01.15 1.42.4z"/>
        <circle cx="20" cy="10" r="2" stroke="currentColor"/>
        <path d="M24 15.75v.5c0 .41-.34.75-.75.75H19v-.25c0-1.37-.66-2.59-1.67-3.35.41-.25.9-.4 1.42-.4h2.5c1.52 0 2.75 1.23 2.75 2.75z"/>
        <circle cx="12" cy="9.5" r="3" stroke="currentColor" />
        <path d="M14.75 14h-5.5a2.752 2.752 0 0 0-2.75 2.75v1.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-1.5A2.752 2.752 0 0 0 14.75 14z"/>
      </>
    ) : (
      <>
        <circle cx="4" cy="10" r="2" stroke="currentColor" />
        <path d="M6.67 13.4A4.19 4.19 0 0 0 5 16.75V17H.75c-.41 0-.75-.34-.75-.75v-.5C0 14.23 1.23 13 2.75 13h2.5c.52 0 1.01.15 1.42.4z" stroke="currentColor" />
        <circle cx="20" cy="10" r="2" stroke="currentColor" />
        <path d="M24 15.75v.5c0 .41-.34.75-.75.75H19v-.25c0-1.37-.66-2.59-1.67-3.35.41-.25.9-.4 1.42-.4h2.5c1.52 0 2.75 1.23 2.75 2.75z" stroke="currentColor" />
        <circle cx="12" cy="9.5" r="3" stroke="currentColor" />
        <path d="M14.75 14h-5.5a2.752 2.752 0 0 0-2.75 2.75v1.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-1.5A2.752 2.752 0 0 0 14.75 14z" stroke="currentColor" />
      </>
    )}
  </svg>
);
};

interface FavouriteIconProps extends React.SVGProps<SVGSVGElement> {
  isActive: boolean;
}
export const FavouriteIcon: React.FC<FavouriteIconProps> = ({ isActive, ...props }) => {
  const {isDarkMode}=useTheme();
return(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="16"
    viewBox="0 0 22 24"
    {...props}
    className={`cursor-pointer transition-all duration-300 ease-in-out ${isActive ?  'fill-current text-gray-600' : 'fill-none text-gray-500'}`}
  >
    <path
      d="M12 23a.5.5 0 0 1-.356-.149L1.836 12.88c-2.444-2.483-2.444-6.525 0-9.01A6.191 6.191 0 0 1 6.279 2a6.19 6.19 0 0 1 4.443 1.87L12 5.17l1.278-1.3A6.19 6.19 0 0 1 17.721 2a6.19 6.19 0 0 1 4.442 1.87c2.444 2.484 2.444 6.526 0 9.01l-9.807 9.971A.5.5 0 0 1 12 23z"
      fill={isActive ? 'currentColor' : 'none'}
      style={{ color: isDarkMode ? "#FFFFFF" :undefined }}
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);
};

interface MyFilterIconProps extends React.SVGProps<SVGSVGElement> {
  isActive: boolean;
}
export const MyFilterIcon: React.FC<MyFilterIconProps> = ({ isActive, ...props }) => {
  const {isDarkMode}=useTheme();
  return(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 28 30"
    {...props}
    className={`cursor-pointer transition-all duration-300 ease-in-out ${isActive ? 'fill-current text-gray-600' : 'fill-none text-gray-500'}`}
  >
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill={isActive ? 'currentColor' : 'transparent'} style={{ color: isDarkMode ? "#FFFFFF" : undefined }}/>
    <path d="M12 18c-5 0-9 3-9 6v4h18v-4c0-3-4-6-9-6z" stroke="currentColor" strokeWidth="2" fill={isActive ? 'currentColor' : 'transparent'} style={{ color: isDarkMode ? "#FFFFFF" : undefined }}
    />
  </svg>
);
};


interface QueryIconProps {
  className?: string;
}

export const QueryIcon: React.FC<QueryIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    className={` ${className}`}
  >
    <path
      d="M4.926 3.929c-.352.26-.426.459-.426.571 0 .112.074.31.426.571.342.253.87.502 1.566.72C7.88 6.224 9.827 6.5 12 6.5s4.12-.276 5.508-.71c.696-.217 1.224-.466 1.566-.719.352-.26.426-.459.426-.571 0-.112-.074-.31-.426-.571-.342-.253-.87-.502-1.566-.72C16.12 2.776 14.173 2.5 12 2.5s-4.12.276-5.508.71c-.696.217-1.224.466-1.566.719Zm1.268-1.674C7.702 1.784 9.754 1.5 12 1.5c2.245 0 4.298.284 5.806.755.751.235 1.395.525 1.862.87.458.338.832.797.832 1.375s-.374 1.037-.832 1.375c-.467.345-1.111.635-1.862.87-1.508.471-3.56.755-5.806.755-2.245 0-4.298-.284-5.806-.755-.751-.235-1.395-.525-1.862-.87C3.874 5.537 3.5 5.078 3.5 4.5s.374-1.037.832-1.375c.467-.345 1.111-.635 1.862-.87ZM6.492 15.79c1.388.434 3.335.71 5.508.71s4.12-.276 5.508-.71c.696-.217 1.224-.466 1.566-.719.352-.26.426-.459.426-.571h1c0 .578-.374 1.037-.832 1.375-.467.345-1.111.635-1.862.87-1.508.471-3.56.755-5.806.755-2.245 0-4.298-.284-5.806-.755-.751-.235-1.395-.524-1.862-.87-.458-.338-.832-.797-.832-1.375h1c0 .112.074.31.426.571.342.253.87.502 1.566.72ZM6.492 10.79c1.388.434 3.335.71 5.508.71s4.12-.276 5.508-.71c.696-.217 1.224-.466 1.566-.719.352-.26.426-.459.426-.571h1c0 .578-.374 1.037-.832 1.375-.467.345-1.111.635-1.862.87-1.508.471-3.56.755-5.806.755-2.245 0-4.298-.284-5.806-.755-.751-.235-1.395-.524-1.862-.87-.458-.338-.832-.797-.832-1.375h1c0 .112.074.31.426.571.342.253.87.502 1.566.72Z"
      fill="currentColor"
    />
    <path
      d="M4.5 4.5v15c0 .112.074.31.426.571.342.253.87.502 1.566.72 1.388.433 3.335.709 5.508.709s4.12-.276 5.508-.71c.696-.217 1.224-.466 1.566-.719.352-.26.426-.459.426-.571v-15h1v15c0 .578-.374 1.037-.832 1.375-.467.345-1.111.635-1.862.87-1.508.471-3.56.755-5.806.755-2.245 0-4.298-.284-5.806-.755-.751-.235-1.395-.524-1.862-.87-.458-.338-.832-.797-.832-1.375v-15h1Z"
      fill="currentColor"
    />
  </svg>
);


interface HistoryIconProps {
  className?: string;
}

export const HistoryIcon: React.FC<HistoryIconProps> = ({className  }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    className={` ${className}`}
  >
    <path d="M12 24a11.917 11.917 0 0 1-8.483-3.517.5.5 0 0 1 .707-.707A10.926 10.926 0 0 0 12 23c6.065 0 11-4.935 11-11S18.065 1 12 1C6.88 1 2.362 4.62 1.258 9.608a.5.5 0 0 1-.977-.216C1.486 3.95 6.415 0 12 0c6.617 0 12 5.383 12 12s-5.383 12-12 12z" 
     fill="currentColor" />
    <path d="M7.5 10h-7a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 1 0V9h6.5a.5.5 0 0 1 0 1zM19 12.5h-7a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 1 0v6.5H19a.5.5 0 0 1 0 1z" 
     fill="currentColor"/>
  </svg>
);


interface ConfigurationIconProps {
  className?: string;
}
export const ConfigurationIcon: React.FC<ConfigurationIconProps> = ({ className  }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    className={` ${className}`}
  >
    <path d="M12 17c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-9c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z" 
     fill="currentColor"/>
    <path d="M13.7 24h-3.4a1.505 1.505 0 0 1-1.458-1.172l-.461-2.048a9.113 9.113 0 0 1-2.175-1.263l-1.996.63c-.679.21-1.417-.076-1.756-.683L.757 16.53a1.516 1.516 0 0 1 .28-1.854l1.542-1.417C2.527 12.833 2.5 12.411 2.5 12s.027-.833.079-1.259L1.042 9.328a1.517 1.517 0 0 1-.288-1.853l1.704-2.946c.337-.6 1.076-.886 1.751-.677l1.998.63A9.15 9.15 0 0 1 8.381 3.22l.461-2.05A1.505 1.505 0 0 1 10.3 0h3.4c.694 0 1.307.493 1.458 1.171l.461 2.049a9.113 9.113 0 0 1 2.175 1.263l1.996-.63a1.506 1.506 0 0 1 1.756.682l1.697 2.934a1.519 1.519 0 0 1-.28 1.855l-1.542 1.417c.052.426.079.848.079 1.259s-.027.833-.079 1.259l1.538 1.413.004.004c.509.479.625 1.239.283 1.849l-1.704 2.946c-.336.6-1.075.888-1.751.677l-1.998-.63a9.146 9.146 0 0 1-2.175 1.263l-.461 2.05A1.503 1.503 0 0 1 13.7 24zm-7.39-5.54c.115 0 .227.04.318.114a8.135 8.135 0 0 0 2.355 1.367c.16.059.278.194.315.359l.52 2.31c.05.226.253.39.482.39h3.4a.497.497 0 0 0 .481-.389l.521-2.311a.5.5 0 0 1 .314-.359 8.167 8.167 0 0 0 2.355-1.367.507.507 0 0 1 .468-.091l2.25.71a.49.49 0 0 0 .583-.218l1.704-2.946a.517.517 0 0 0-.098-.624l-1.728-1.587a.498.498 0 0 1-.156-.441c.071-.467.106-.93.106-1.377s-.035-.91-.104-1.377a.5.5 0 0 1 .156-.441l1.73-1.59a.516.516 0 0 0 .092-.627L20.677 5.03a.494.494 0 0 0-.589-.223l-2.248.71a.5.5 0 0 1-.468-.091 8.135 8.135 0 0 0-2.355-1.367.499.499 0 0 1-.315-.359l-.52-2.31A.499.499 0 0 0 13.7 1h-3.4a.497.497 0 0 0-.481.388L9.298 3.7a.499.499 0 0 1-.315.359c-.839.31-1.631.77-2.355 1.367a.497.497 0 0 1-.468.091l-2.25-.71a.494.494 0 0 0-.584.217L1.623 7.97a.515.515 0 0 0 .1.625l1.726 1.586a.498.498 0 0 1 .156.441c-.07.468-.105.931-.105 1.378s.035.91.104 1.377a.5.5 0 0 1-.156.441l-1.73 1.59a.516.516 0 0 0-.092.627l1.697 2.934a.495.495 0 0 0 .589.223l2.248-.709a.515.515 0 0 1 .15-.023z"
     fill="currentColor" />
  </svg>
);

interface SchedulesProps 
{
  className?: string;
}

export const SchedulesIcon: React.FC<SchedulesProps> = ({ className  }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    className={`${className}`}
  >
  <path d="M21.5 24h-19A2.503 2.503 0 0 1 0 21.5v-17C0 3.122 1.122 2 2.5 2h19C22.878 2 24 3.122 24 4.5v17c0 1.378-1.122 2.5-2.5 2.5zM2.5 3C1.673 3 1 3.673 1 4.5v17c0 .827.673 1.5 1.5 1.5h19c.827 0 1.5-.673 1.5-1.5v-17c0-.827-.673-1.5-1.5-1.5h-19z"
     fill="currentColor"/>
    <path d="M23.5 9H.5a.5.5 0 0 1 0-1h23a.5.5 0 0 1 0 1zM5.5 5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 1 0v4a.5.5 0 0 1-.5.5zM18.5 5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 1 0v4a.5.5 0 0 1-.5.5z"
    fill="currentColor"/>
    </svg>);


interface OkIconProps {
  className?: string;
  color?: string; 
}

export const OkIcon: React.FC<OkIconProps> = ({ className, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      d="M9.125 18.875a.744.744 0 0 1-.53-.22L2.47 12.53a.75.75 0 1 1 1.061-1.061l5.595 5.595 11.72-11.72a.75.75 0 1 1 1.061 1.061l-12.25 12.25a.752.75 0 0 1-.532.22z"
      stroke={color} 
      strokeWidth="2"
    />
  </svg>
);

