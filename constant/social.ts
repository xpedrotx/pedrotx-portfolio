import type { IconType } from "react-icons";

import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";

interface Social {
  name: string;
  handle: string;
  url: string;
  icon: IconType;
}

export const socials = [
  {
    name: "GitHub",
    handle: "xpedrotx",
    url: "https://github.com/xpedrotx",
    icon: FaGithub,
  },
  {
    name: "LinkedIn",
    handle: "pedrohltx",
    url: "https://linkedin.com/in/pedrohltx",
    icon: FaLinkedin,
  },
  {
    name: "Instagram",
    handle: "xpedrotx",
    url: "https://instagram.com/xpedrotx",
    icon: FaInstagram,
  },
  {
    name: "LeetCode",
    handle: "pedrotx",
    url: "https://leetcode.com/u/pedrotx",
    icon: SiLeetcode,
  },
] satisfies Social[];
