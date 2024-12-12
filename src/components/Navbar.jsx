import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profile from '../assets/profile.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   
  const getName = localStorage.getItem("adminName");

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminName');
    navigate("/login");
  }

  const handleProfileNavigate = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  const handleClickOutside = (e) => {
    if (e.target.closest('.user-dropdown-container')) return;
    setIsDropdownOpen(false);
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-[60px] w-full fixed z-10 top-0 bg-white shadow-md">
      <div className="flex justify-between px-14 py-1">
      <div>
        <svg
          width="140"
          height="50"
          viewBox="0 0 145 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M90.6944 23.5529C90.7076 27.5046 93.6617 30.4744 97.562 30.4566C101.504 30.4391 104.496 27.3849 104.487 23.3875C104.478 19.4847 101.394 16.4203 97.5077 16.4527C93.6416 16.485 90.6811 19.5701 90.6944 23.5529ZM104.102 14.7441V7.62939e-06H108.03C108.043 0.285515 108.065 0.54472 108.065 0.80407C108.076 8.44099 108.1 16.0782 108.087 23.7153C108.078 29.364 103.643 34.035 98.1256 34.2627C92.3077 34.503 87.6001 30.4099 87.0544 24.637C86.3287 16.961 92.9796 11.139 100.364 13.0648C101.663 13.4037 102.852 14.1704 104.102 14.7441Z"
            fill="#2C536B"
          />
          <path
            d="M48.1833 30.4567C52.0695 30.4636 55.2086 27.4028 55.2013 23.6137C55.1937 19.6023 52.1867 16.4812 48.3089 16.4599C44.4143 16.4388 41.3256 19.5017 41.3085 23.402C41.2913 27.3347 44.3268 30.4499 48.1833 30.4567ZM37.788 7.62939e-06H41.749V14.939C41.984 14.8466 42.1373 14.823 42.2431 14.7393C47.6463 10.4607 57.2353 12.9287 58.7204 21.6358C59.6823 27.2739 56.1648 32.6684 50.7937 33.9669C44.1116 35.5824 37.8017 30.5983 37.8048 23.7225C37.8082 16.0951 37.7945 8.46752 37.788 0.839954C37.7877 0.577148 37.788 0.314339 37.788 7.62939e-06Z"
            fill="#2C536B"
          />
          <path
            d="M25.4706 30.3812C29.3779 30.3862 32.5521 27.2232 32.5429 23.334C32.5332 19.2065 29.4713 16.1322 25.3813 16.1432C21.6217 16.1533 18.6194 19.329 18.6211 23.2937C18.6227 27.3655 21.5323 30.3763 25.4706 30.3812ZM32.092 14.6601V12.5085H36.0304V33.7653H32.1478V31.9264C29.0239 34.2095 25.7269 34.8482 22.175 33.7468C19.9768 33.065 18.229 31.7015 16.9158 29.7863C14.0332 25.5822 14.3364 19.6859 17.6127 15.8703C18.8013 14.4862 20.2617 13.5093 21.9592 12.8957C23.6592 12.281 25.394 12.1802 27.1736 12.4298C28.9663 12.681 30.5189 13.4754 32.092 14.6601Z"
            fill="#2C536B"
          />
          <path
            d="M127.559 43.0448C128.597 40.6576 129.558 38.4472 130.519 36.2366C131.059 34.9955 131.576 33.7435 132.149 32.518C132.396 31.9903 132.387 31.5545 132.148 31.0173C129.493 25.0523 126.864 19.0757 124.229 13.1017C124.134 12.8867 124.05 12.6662 123.909 12.3194C125.278 12.3194 126.566 12.2862 127.849 12.3525C128.059 12.3635 128.314 12.783 128.435 13.0647C130.329 17.4804 132.203 21.9047 134.084 26.3262C134.197 26.5924 134.324 26.8526 134.508 27.2553C134.679 26.8814 134.801 26.6307 134.909 26.3738C136.786 21.9509 138.674 17.5325 140.522 13.0972C140.78 12.4798 141.112 12.2745 141.747 12.3061C142.786 12.3574 143.83 12.3198 145 12.3198C144.872 12.6529 144.783 12.913 144.673 13.1637C140.427 22.8948 136.175 32.6229 131.944 42.3609C131.721 42.8754 131.471 43.0836 130.911 43.0586C129.848 43.011 128.781 43.0448 127.559 43.0448Z"
            fill="#2C536B"
          />
          <path
            d="M20.2121 5.34502V9.00766C19.8789 9.00766 19.593 9.00752 19.307 9.00766C15.98 9.00954 12.6527 8.99349 9.32596 9.01822C5.82257 9.04396 4.00103 10.8789 4.00872 14.3154C4.01242 15.9103 4.00931 17.5053 4.00931 19.1722H12.8508C12.5742 20.478 12.3166 21.695 12.0412 22.9957H4.04068V33.3939H0.0196888C0.0196888 33.0846 0.0198357 32.7808 0.0195398 32.477C0.013177 26.5778 0.00681585 20.6785 9.12665e-06 14.7793C-0.00664962 9.19434 3.6308 5.4701 9.36265 5.32146C12.8484 5.23094 16.3384 5.29485 19.8264 5.29181C19.9301 5.29181 20.0335 5.31957 20.2121 5.34502Z"
            fill="#2C536B"
          />
          <path
            d="M114.649 33.3939H110.727V12.5393H114.757V15.41C116.747 12.9594 119.269 12.2935 122.152 12.3031V16.3518C121.77 16.3685 121.368 16.3811 120.968 16.4048C117.272 16.6222 114.676 19.2696 114.643 22.9157C114.614 26.0847 114.645 29.254 114.649 32.4233C114.649 32.7152 114.649 33.0069 114.649 33.3939Z"
            fill="#2C536B"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M72.4639 29.9973C71.3137 29.9923 70.0499 29.4221 69.2574 28.9483C68.3788 28.4224 67.6407 27.6671 67.0879 26.86C64.807 23.5301 66.6139 21.2049 65.518 20.1658C65.1896 20.3732 65.0021 21.901 64.96 22.4071C64.7651 24.6828 65.787 27.092 67.2434 28.5385C68.1566 29.4468 69.2353 30.1577 70.7755 30.6168C72.8614 31.2389 73.8561 30.5996 74.3498 31.1327C74.7077 31.5228 74.5176 31.7621 74.3596 32.1571C76.0628 32.004 77.8203 31.0685 78.8249 30.2787C79.5382 29.7184 80.259 28.9852 80.7626 28.2275C81.3154 27.3931 82.0561 28.1064 81.7129 28.694C81.3822 29.2618 80.6712 30.0639 80.2689 30.4292C76.3097 34.038 70.5189 34.3046 66.5152 30.9895C63.5309 28.5211 62.0647 24.8334 62.8175 20.9013C62.899 20.4792 63.0718 20.0103 63.131 19.6301C62.9187 19.7783 62.7855 19.8671 62.6348 20.0176C62.5535 20.0991 62.5139 20.1387 62.4399 20.2471L62.3287 20.4126C62.3214 20.4225 62.3065 20.4397 62.3016 20.4472L62.2375 20.5187C61.6302 22.133 61.9955 24.7322 62.4818 26.2454C63.4692 29.3184 65.8809 31.8682 68.7861 33.0877C75.6284 35.956 83.4211 31.3672 84.1615 23.8708C84.3417 22.0467 84.3146 19.6276 81.624 20.0497C81.508 19.403 80.9403 18.4379 80.6342 17.954C80.2368 17.3197 80.0418 17.1568 79.6099 16.6558L78.5929 15.7301L77.4476 14.9847C76.3047 14.3577 76.1714 14.4713 75.2334 14.1132C74.9076 14.2268 75.1643 13.8542 75.0038 14.4811C74.9841 14.5601 74.999 14.5132 74.994 14.6144C75.8851 14.6959 76.5985 15.1203 77.3241 15.4807L77.5364 15.6018C77.5463 15.6067 77.5611 15.6165 77.5685 15.6215L78.3955 16.1967C78.7361 16.5521 78.6744 16.283 78.8274 16.5249C78.8471 16.557 78.9335 16.8927 79.2668 17.0531C79.6543 17.2407 79.3704 17.0259 79.6172 17.4086L80.1011 18.0034L80.1184 18.038C80.1233 18.0504 80.1306 18.0652 80.1356 18.0751C80.143 18.0873 80.148 18.0998 80.1553 18.112L81.1155 19.9485C81.1896 20.1411 81.2045 20.1905 81.1551 20.3336C81.1328 20.3929 81.0909 20.4472 81.0415 20.4817C80.9131 20.5804 80.9996 20.5063 80.8959 20.5582C80.2023 20.8988 80.2861 22.0639 80.2961 22.7279C80.3332 25.9615 78.304 28.5458 75.6704 29.548C75.1471 29.748 72.9773 30.323 72.4639 29.9973Z"
            fill="#1DA5B1"
            fillOpacity="0.78"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M68.3343 18.0751C67.8209 18.8748 67.0755 19.3018 66.6632 21.1308C66.3497 22.5182 66.4584 23.9942 66.9546 25.2136C67.7025 27.0501 69.8104 29.1506 72.4121 29.2049C74.9002 29.2493 76.6848 28.6718 78.2029 26.6922C81.0687 22.9501 79.0816 17.3914 74.6237 16.3596C73.4389 16.0855 72.0443 16.1201 70.9163 16.4928C69.3858 16.9964 69.1735 17.5024 68.3343 18.0751ZM71.1211 26.3416C70.8595 26.618 70.6422 26.9415 70.035 26.9933C69.4451 27.0451 69.0698 26.7934 68.7984 26.4971C68.5095 26.1786 68.354 25.722 68.4774 25.2111C68.6182 24.6162 68.8749 24.5619 69.2081 24.2336C68.986 23.2068 68.7416 22.449 69.2081 21.2001C69.5266 20.341 70.1683 19.635 70.8051 19.2426C73.3427 17.6801 76.8971 19.2426 77.06 22.4589C77.1168 23.6066 76.7786 24.5347 76.2355 25.2111C74.9174 26.855 73.0785 27.1513 71.1211 26.3416Z"
            fill="#2C536B"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M66.9494 15.5548C66.863 15.8412 66.7099 15.9028 66.5421 16.056L65.6362 17.0901C65.5029 17.2605 65.3696 17.4604 65.2363 17.6628C62.3088 22.1109 63.6122 28.1065 68.1761 30.8909C69.714 31.8288 72.138 32.5545 74.3594 32.1572C74.5174 31.7622 74.7075 31.5227 74.3496 31.1327C73.8559 30.5996 72.8612 31.2388 70.7753 30.6168C69.2351 30.1577 68.1564 29.4469 67.2432 28.5385C65.7868 27.092 64.7649 24.6829 64.9599 22.407C65.0019 21.9011 65.1894 20.3731 65.5178 20.1658C65.466 19.3117 67.4209 16.8705 68.1663 16.5792C68.1021 16.9124 68.0305 17.0654 68.0996 17.4382C68.1441 17.6752 68.3292 17.8973 68.3341 18.075C69.1735 17.5023 69.3856 16.9964 70.9161 16.4929C72.0441 16.1201 73.4387 16.0855 74.6235 16.3596C79.0814 17.3914 81.0685 22.9501 78.2027 26.6922C76.6846 28.6718 74.9 29.2493 72.4119 29.2049L72.6736 29.2864C72.9131 29.3283 73.2463 29.2889 73.4856 29.274L73.5325 30.0047L72.4637 29.9972C72.9772 30.3231 75.1469 29.748 75.6702 29.5481C78.3039 28.5459 80.333 25.9615 80.2959 22.728C80.286 22.0639 80.2021 20.8989 80.8957 20.5583C80.9994 20.5064 80.913 20.5805 81.0413 20.4817C81.0907 20.4471 81.1326 20.3928 81.1549 20.3337C81.2043 20.1904 81.1894 20.1411 81.1154 19.9485L80.1551 18.1121C80.1478 18.0997 80.1429 18.0874 80.1354 18.075C80.1304 18.0652 80.1231 18.0503 80.1182 18.0381L80.1009 18.0035L79.617 17.4086C79.3703 17.026 79.6541 17.2408 79.2666 17.0532C78.9334 16.8927 78.8469 16.557 78.8272 16.5249C78.6742 16.2831 78.7359 16.552 78.3953 16.1966L77.5684 15.6214C77.5609 15.6166 77.5462 15.6067 77.5362 15.6017L77.3239 15.4808C76.5982 15.1204 75.8849 14.6958 74.9939 14.6143C74.9988 14.5131 74.9839 14.5601 75.0036 14.4812C75.1641 13.8541 74.9074 14.2269 75.2332 14.1133C74.6013 13.9232 75.4554 13.4765 73.1598 13.4494C71.5431 13.4295 70.067 13.7727 68.6798 14.4787C68.3538 14.6415 68.0799 14.8044 67.7886 14.9896C67.5344 15.1501 67.1543 15.4758 66.9494 15.5548Z"
            fill="#1DA5B1"
            fillOpacity="0.78"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M63.131 19.6301C63.0717 20.0102 62.8989 20.4792 62.8174 20.9014C62.0646 24.8334 63.5309 28.5212 66.5151 30.9896C70.5188 34.3045 76.3097 34.038 80.2689 30.4293C80.6712 30.0639 81.3821 29.2617 81.7129 28.694C82.0559 28.1065 81.3154 27.3932 80.7626 28.2274C80.2589 28.9853 79.5382 29.7183 78.8249 30.2787C77.8202 31.0686 76.0627 32.0041 74.3595 32.1571C72.138 32.5545 69.714 31.8289 68.1763 30.8908C63.6122 28.1065 62.309 22.1109 65.2364 17.6628C65.3698 17.4604 65.5031 17.2605 65.6364 17.0902L66.5423 16.056C66.7101 15.9029 66.8631 15.8412 66.9496 15.5548L66.9371 15.2216C66.7175 15.1007 66.5151 14.8069 66.1374 15.0563C65.7351 15.3228 64.8835 16.3595 64.5947 16.752C63.7061 17.9688 63.6715 18.3713 63.131 19.6301Z"
            fill="#2C536B"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M62.2375 20.5187L62.3018 20.4472C62.3066 20.4397 62.3215 20.4225 62.3288 20.4126L62.4399 20.2473C62.514 20.1386 62.5535 20.0991 62.635 20.0176C62.7856 19.867 62.9189 19.7783 63.1311 19.6301C63.6716 18.3712 63.7062 17.9689 64.5949 16.752C64.8836 16.3595 65.7352 15.3229 66.1376 15.0562C66.5152 14.807 66.7176 15.1006 66.9374 15.2217C67.0805 14.9403 68.448 14.2243 68.8898 14.0369C69.6969 13.6962 70.4547 13.4542 71.3928 13.3111C74.6066 12.8249 77.5267 13.8862 79.7778 15.9497C80.0172 16.167 80.2937 16.6582 80.7552 16.5915C81.0811 16.5446 81.4488 16.1127 80.9725 15.619C80.1506 14.76 79.4149 14.091 78.2548 13.4839C73.3946 10.9266 67.7148 12.0177 64.3604 16.1374C63.6519 17.0062 62.4078 19.0501 62.2375 20.5187Z"
            fill="#1DA5B1"
            fillOpacity="0.78"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M69.2082 24.2336C68.875 24.5619 68.6183 24.6162 68.4775 25.2111C68.3541 25.722 68.5096 26.1786 68.7984 26.4971C69.0699 26.7934 69.4452 27.0451 70.0351 26.9933C70.6423 26.9414 70.8595 26.618 71.1212 26.3416C71.4519 25.7195 71.4297 25.0334 70.9533 24.5594C70.4226 24.0362 70.0179 24.0066 69.2082 24.2336Z"
            fill="#1DA5B1"
            fillOpacity="0.78"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M82.6137 16.5249C81.1129 17.0161 81.9028 19.1216 83.2826 18.6773C84.7167 18.2157 84.0058 16.0658 82.6137 16.5249Z"
            fill="#1DA5B1"
            fillOpacity="0.78"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M73.6957 25.0457C74.0833 23.8609 72.2936 23.3549 71.9506 24.4854C71.5903 25.6727 73.3329 26.1515 73.6957 25.0457Z"
            fill="#1DA5B1"
            fillOpacity="0.78"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M71.4394 23.3228C71.7109 22.3971 70.383 22.0368 70.0597 22.8118C69.6475 23.7943 71.168 24.2459 71.4394 23.3228Z"
            fill="#2C536B"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M83.9714 14.0738C83.0901 14.259 83.374 15.619 84.3021 15.3945C85.1191 15.1944 84.8551 13.8862 83.9714 14.0738Z"
            fill="#2C536B"
          />
          <path
            d="M7.20375 42.1132L4.3095 47.6467V51H3.14925V47.6467L0.24225 42.1132H1.53L3.723 46.614L5.916 42.1132H7.20375ZM11.4748 51.1148C10.8203 51.1148 10.2253 50.966 9.6898 50.6685C9.1628 50.371 8.7463 49.9502 8.4403 49.4062C8.1428 48.8537 7.99405 48.2162 7.99405 47.4937C7.99405 46.7797 8.14705 46.1507 8.45305 45.6067C8.76755 45.0542 9.19255 44.6335 9.72805 44.3445C10.2636 44.047 10.8628 43.8982 11.5258 43.8982C12.1888 43.8982 12.7881 44.047 13.3236 44.3445C13.8591 44.6335 14.2798 45.05 14.5858 45.594C14.9003 46.138 15.0576 46.7712 15.0576 47.4937C15.0576 48.2162 14.8961 48.8537 14.5731 49.4062C14.2586 49.9502 13.8293 50.371 13.2853 50.6685C12.7413 50.966 12.1378 51.1148 11.4748 51.1148ZM11.4748 50.0947C11.8913 50.0947 12.2823 49.997 12.6478 49.8015C13.0133 49.606 13.3066 49.3127 13.5276 48.9217C13.7571 48.5307 13.8718 48.0547 13.8718 47.4937C13.8718 46.9327 13.7613 46.4567 13.5403 46.0657C13.3193 45.6747 13.0303 45.3857 12.6733 45.1987C12.3163 45.0032 11.9296 44.9055 11.5131 44.9055C11.0881 44.9055 10.6971 45.0032 10.3401 45.1987C9.99155 45.3857 9.71105 45.6747 9.49855 46.0657C9.28605 46.4567 9.1798 46.9327 9.1798 47.4937C9.1798 48.0632 9.2818 48.5435 9.4858 48.9345C9.6983 49.3255 9.9788 49.6187 10.3273 49.8142C10.6758 50.0012 11.0583 50.0947 11.4748 50.0947ZM22.7796 44.013V51H21.6193V49.9672C21.3983 50.3242 21.0881 50.6047 20.6886 50.8087C20.2976 51.0043 19.8641 51.102 19.3881 51.102C18.8441 51.102 18.3553 50.9915 17.9218 50.7705C17.4883 50.541 17.1441 50.201 16.8891 49.7505C16.6426 49.3 16.5193 48.7517 16.5193 48.1057V44.013H17.6668V47.9527C17.6668 48.6412 17.8411 49.1725 18.1896 49.5465C18.5381 49.912 19.0141 50.0947 19.6176 50.0947C20.2381 50.0947 20.7268 49.9035 21.0838 49.521C21.4408 49.1385 21.6193 48.5817 21.6193 47.8507V44.013H22.7796ZM25.8988 45.1477C26.1028 44.7482 26.3918 44.438 26.7658 44.217C27.1483 43.996 27.6116 43.8855 28.1556 43.8855V45.084H27.8496C26.5491 45.084 25.8988 45.7895 25.8988 47.2005V51H24.7386V44.013H25.8988V45.1477ZM34.0544 50.0565H37.1654V51H32.8941V42.1132H34.0544V50.0565ZM37.964 47.481C37.964 46.767 38.1085 46.1422 38.3975 45.6067C38.6865 45.0627 39.0818 44.642 39.5833 44.3445C40.0933 44.047 40.6585 43.8982 41.279 43.8982C41.891 43.8982 42.4223 44.03 42.8728 44.2935C43.3233 44.557 43.659 44.8885 43.88 45.288V44.013H45.053V51H43.88V49.6995C43.6505 50.1075 43.3063 50.4475 42.8473 50.7195C42.3968 50.983 41.8698 51.1148 41.2663 51.1148C40.6458 51.1148 40.0848 50.9618 39.5833 50.6557C39.0818 50.3497 38.6865 49.9205 38.3975 49.368C38.1085 48.8155 37.964 48.1865 37.964 47.481ZM43.88 47.4937C43.88 46.9667 43.7738 46.5077 43.5613 46.1167C43.3488 45.7257 43.0598 45.4282 42.6943 45.2242C42.3373 45.0117 41.942 44.9055 41.5085 44.9055C41.075 44.9055 40.6798 45.0075 40.3228 45.2115C39.9658 45.4155 39.681 45.713 39.4685 46.104C39.256 46.495 39.1498 46.954 39.1498 47.481C39.1498 48.0165 39.256 48.484 39.4685 48.8835C39.681 49.2745 39.9658 49.5762 40.3228 49.7887C40.6798 49.9927 41.075 50.0947 41.5085 50.0947C41.942 50.0947 42.3373 49.9927 42.6943 49.7887C43.0598 49.5762 43.3488 49.2745 43.5613 48.8835C43.7738 48.484 43.88 48.0207 43.88 47.4937ZM53.2102 44.013V51H52.05V49.9672C51.829 50.3242 51.5187 50.6047 51.1192 50.8087C50.7282 51.0043 50.2947 51.102 49.8187 51.102C49.2747 51.102 48.786 50.9915 48.3525 50.7705C47.919 50.541 47.5747 50.201 47.3197 49.7505C47.0732 49.3 46.95 48.7517 46.95 48.1057V44.013H48.0975V47.9527C48.0975 48.6412 48.2717 49.1725 48.6202 49.5465C48.9687 49.912 49.4447 50.0947 50.0482 50.0947C50.6687 50.0947 51.1575 49.9035 51.5145 49.521C51.8715 49.1385 52.05 48.5817 52.05 47.8507V44.013H53.2102ZM58.5735 43.8855C59.4235 43.8855 60.112 44.1447 60.639 44.6632C61.166 45.1732 61.4295 45.9127 61.4295 46.8817V51H60.282V47.0475C60.282 46.3505 60.1078 45.8192 59.7593 45.4537C59.4108 45.0797 58.9348 44.8927 58.3313 44.8927C57.7193 44.8927 57.2305 45.084 56.865 45.4665C56.508 45.849 56.3295 46.4057 56.3295 47.1367V51H55.1693V44.013H56.3295V45.0075C56.559 44.6505 56.8693 44.3742 57.2603 44.1787C57.6598 43.9832 58.0975 43.8855 58.5735 43.8855ZM62.8913 47.481C62.8913 46.767 63.0358 46.1422 63.3248 45.6067C63.6138 45.0627 64.009 44.642 64.5105 44.3445C65.0205 44.047 65.59 43.8982 66.219 43.8982C66.763 43.8982 67.2688 44.0257 67.7363 44.2807C68.2038 44.5272 68.5608 44.8545 68.8073 45.2625V41.565H69.9803V51H68.8073V49.6867C68.5778 50.1032 68.2378 50.4475 67.7873 50.7195C67.3368 50.983 66.8098 51.1148 66.2063 51.1148C65.5858 51.1148 65.0205 50.9618 64.5105 50.6557C64.009 50.3497 63.6138 49.9205 63.3248 49.368C63.0358 48.8155 62.8913 48.1865 62.8913 47.481ZM68.8073 47.4937C68.8073 46.9667 68.701 46.5077 68.4885 46.1167C68.276 45.7257 67.987 45.4282 67.6215 45.2242C67.2645 45.0117 66.8693 44.9055 66.4358 44.9055C66.0023 44.9055 65.607 45.0075 65.25 45.2115C64.893 45.4155 64.6083 45.713 64.3958 46.104C64.1833 46.495 64.077 46.954 64.077 47.481C64.077 48.0165 64.1833 48.484 64.3958 48.8835C64.6083 49.2745 64.893 49.5762 65.25 49.7887C65.607 49.9927 66.0023 50.0947 66.4358 50.0947C66.8693 50.0947 67.2645 49.9927 67.6215 49.7887C67.987 49.5762 68.276 49.2745 68.4885 48.8835C68.701 48.484 68.8073 48.0207 68.8073 47.4937ZM73.1012 45.1477C73.3052 44.7482 73.5942 44.438 73.9682 44.217C74.3507 43.996 74.814 43.8855 75.358 43.8855V45.084H75.052C73.7515 45.084 73.1012 45.7895 73.1012 47.2005V51H71.941V44.013H73.1012V45.1477ZM82.7153 44.013L78.5078 54.2895H77.3093L78.6863 50.9235L75.8686 44.013H77.1563L79.3493 49.674L81.5168 44.013H82.7153ZM88.4411 43.0567V46.0275H91.6796V46.9837H88.4411V50.0437H92.0621V51H87.2808V42.1005H92.0621V43.0567H88.4411ZM97.4642 51L95.8067 48.399L94.2129 51H93.0017L95.2584 47.532L93.0017 44.013H94.3149L95.9724 46.6012L97.5534 44.013H98.7647L96.5207 47.4682L98.7774 51H97.4642ZM101.079 45.3007C101.309 44.9012 101.649 44.5697 102.099 44.3062C102.558 44.0342 103.089 43.8982 103.693 43.8982C104.313 43.8982 104.874 44.047 105.376 44.3445C105.886 44.642 106.285 45.0627 106.574 45.6067C106.863 46.1422 107.008 46.767 107.008 47.481C107.008 48.1865 106.863 48.8155 106.574 49.368C106.285 49.9205 105.886 50.3497 105.376 50.6557C104.874 50.9618 104.313 51.1148 103.693 51.1148C103.098 51.1148 102.571 50.983 102.112 50.7195C101.661 50.4475 101.317 50.1117 101.079 49.7122V54.315H99.9188V44.013H101.079V45.3007ZM105.822 47.481C105.822 46.954 105.716 46.495 105.503 46.104C105.291 45.713 105.002 45.4155 104.636 45.2115C104.279 45.0075 103.884 44.9055 103.451 44.9055C103.026 44.9055 102.63 45.0117 102.265 45.2242C101.908 45.4282 101.619 45.73 101.398 46.1295C101.185 46.5205 101.079 46.9752 101.079 47.4937C101.079 48.0207 101.185 48.484 101.398 48.8835C101.619 49.2745 101.908 49.5762 102.265 49.7887C102.63 49.9927 103.026 50.0947 103.451 50.0947C103.884 50.0947 104.279 49.9927 104.636 49.7887C105.002 49.5762 105.291 49.2745 105.503 48.8835C105.716 48.484 105.822 48.0165 105.822 47.481ZM114.91 47.2387C114.91 47.4597 114.897 47.6935 114.872 47.94H109.287C109.33 48.6285 109.563 49.1682 109.988 49.5592C110.422 49.9417 110.945 50.133 111.557 50.133C112.058 50.133 112.475 50.0182 112.806 49.7887C113.146 49.5507 113.384 49.2362 113.52 48.8452H114.77C114.583 49.5167 114.209 50.065 113.648 50.49C113.087 50.9065 112.39 51.1148 111.557 51.1148C110.894 51.1148 110.299 50.966 109.772 50.6685C109.253 50.371 108.845 49.9502 108.548 49.4062C108.25 48.8537 108.101 48.2162 108.101 47.4937C108.101 46.7712 108.246 46.138 108.535 45.594C108.824 45.05 109.228 44.6335 109.746 44.3445C110.273 44.047 110.877 43.8982 111.557 43.8982C112.22 43.8982 112.806 44.0427 113.316 44.3317C113.826 44.6207 114.217 45.0202 114.489 45.5302C114.77 46.0317 114.91 46.6012 114.91 47.2387ZM113.711 46.9965C113.711 46.5545 113.614 46.1762 113.418 45.8617C113.223 45.5387 112.955 45.2965 112.615 45.135C112.283 44.965 111.914 44.88 111.506 44.88C110.919 44.88 110.418 45.067 110.001 45.441C109.593 45.815 109.359 46.3335 109.3 46.9965H113.711ZM117.602 45.1477C117.806 44.7482 118.095 44.438 118.469 44.217C118.851 43.996 119.314 43.8855 119.858 43.8855V45.084H119.552C118.252 45.084 117.602 45.7895 117.602 47.2005V51H116.441V44.013H117.602V45.1477ZM122.613 44.9692V49.0875C122.613 49.4275 122.685 49.6697 122.83 49.8142C122.974 49.9502 123.225 50.0182 123.582 50.0182H124.436V51H123.391C122.745 51 122.26 50.8512 121.937 50.5537C121.614 50.2562 121.453 49.7675 121.453 49.0875V44.9692H120.548V44.013H121.453V42.2535H122.613V44.013H124.436V44.9692H122.613Z"
            fill="#1DA5B1"
            fillOpacity="0.78"
          />
        </svg>
      </div>
        <div className="flex items-center text-[#68686C]">
          <div className='text-sm'>
            <p>Hey <span className="text-black capitalize">{getName}</span> 👋🏻, Welcome Back !</p>
          </div>
          <div className="px-4">
          <svg
            width="23"
            height="23"
            viewBox="0 0 33 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_249_150)">
              <path
                d="M24.0623 0C19.1344 0 15.125 4.00944 15.125 8.93758C15.125 13.8655 19.1344 17.8749 24.0623 17.8749C28.9905 17.8749 32.9999 13.8655 32.9999 8.93758C32.9999 4.00944 28.9905 0 24.0623 0ZM25.4375 12.0313C25.4375 12.6006 24.9755 13.0626 24.4062 13.0626C23.837 13.0626 23.375 12.6006 23.375 12.0313V7.56242H22.6874C22.1182 7.56242 21.6562 7.10042 21.6562 6.53117C21.6562 5.96191 22.1182 5.49992 22.6874 5.49992H24.4062C24.9755 5.49992 25.4375 5.96191 25.4375 6.53117V12.0313Z"
                fill="#666666"
              />
              <path
                d="M19.2501 27.5001C19.2501 30.5377 16.7875 33 13.7499 33C10.7123 33 8.25 30.5377 8.25 27.5001C8.25 24.4625 10.7123 21.9999 13.7499 21.9999C16.7875 21.9999 19.2501 24.4625 19.2501 27.5001Z"
                fill="#4E4CD1"
              />
              <path
                d="M24.5025 20.6031C24.3555 20.6084 24.211 20.625 24.0624 20.625C17.6179 20.625 12.375 15.3821 12.375 8.93758C12.375 6.6729 13.0336 4.56358 14.153 2.77072C14.0181 2.76518 13.8861 2.75008 13.7499 2.75008C8.4426 2.75008 4.125 7.06743 4.125 12.375V16.2084C4.125 18.9296 2.93287 21.4981 0.841415 23.2663C0.306656 23.7228 0 24.3897 0 25.0937C0 26.4207 1.07934 27.5001 2.40617 27.5001H25.0937C26.4207 27.5001 27.5001 26.4207 27.5001 25.0937C27.5001 24.3897 27.1934 23.7228 26.6448 23.254C25.7578 22.5032 25.0428 21.5986 24.5025 20.6031Z"
                fill="#7B79F5"
              />
            </g>
            <defs>
              <clipPath id="clip0_249_150">
                <rect width="33" height="33" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
          <div className="pl-10 relative user-dropdown-container">
            <div 
              onClick={toggleDropdown} 
              className="flex gap-2 items-center cursor-pointer"
            >
              <img 
                src={profile} 
                alt="profile-image" 
                className='w-8 h-8 object-contain rounded-full p-0.5' 
              />
              <p className='text-sm capitalize'>{getName}</p>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                <ul className="py-1">
                  <li 
                    onClick={handleProfileNavigate}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="mr-2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Settings
                  </li>
                  <li 
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="mr-2"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;