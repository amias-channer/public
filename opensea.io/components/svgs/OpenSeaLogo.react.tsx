import React from "react"
import { HUES } from "../../styles/themes"

interface Props {
  className?: string
  width?: number
  fill?: string
}

const OpenSeaLogo = ({ className, fill = HUES.gray, width }: Props) => (
  <svg
    className={className}
    fill={fill}
    style={{ width: width }}
    viewBox="1 1 23 23"
  >
    <path d="M3.30112 13.2783L3.37112 13.1683L7.59112 6.56659C7.65278 6.46992 7.79779 6.47992 7.84445 6.58492C8.54945 8.16492 9.15779 10.1299 8.87279 11.3533C8.75112 11.8566 8.41779 12.5383 8.04279 13.1683C7.99445 13.2599 7.94112 13.3499 7.88445 13.4366C7.85779 13.4766 7.81279 13.4999 7.76445 13.4999H3.42445C3.30778 13.4999 3.23945 13.3733 3.30112 13.2783Z" />
    <path d="M22.1111 14.505V15.55C22.1111 15.61 22.0744 15.6633 22.0211 15.6867C21.6944 15.8267 20.5761 16.34 20.1111 16.9867C18.9244 18.6383 18.0178 21 15.9911 21H7.53608C4.53942 21 2.11108 18.5633 2.11108 15.5567V15.46C2.11108 15.38 2.17608 15.315 2.25608 15.315H6.96942C7.06275 15.315 7.13108 15.4017 7.12275 15.4933C7.08942 15.8 7.14608 16.1133 7.29108 16.3983C7.57108 16.9667 8.15108 17.3217 8.77775 17.3217H11.1111V15.5H8.80442C8.68608 15.5 8.61608 15.3633 8.68442 15.2667C8.70942 15.2283 8.73775 15.1883 8.76775 15.1433C8.98608 14.8333 9.29775 14.3517 9.60775 13.8033C9.81941 13.4333 10.0244 13.0383 10.1894 12.6417C10.2228 12.57 10.2494 12.4967 10.2761 12.425C10.3211 12.2983 10.3677 12.18 10.4011 12.0617C10.4344 11.9617 10.4611 11.8567 10.4877 11.7583C10.5661 11.4217 10.5994 11.065 10.5994 10.695C10.5994 10.55 10.5928 10.3983 10.5794 10.2533C10.5728 10.095 10.5528 9.93667 10.5328 9.77833C10.5194 9.63833 10.4944 9.5 10.4677 9.355C10.4344 9.14333 10.3878 8.93333 10.3344 8.72167L10.3161 8.64167C10.2761 8.49667 10.2427 8.35833 10.1961 8.21333C10.0644 7.75833 9.91275 7.315 9.75275 6.9C9.69442 6.735 9.62775 6.57667 9.56108 6.41833C9.46275 6.18 9.36275 5.96333 9.27108 5.75833C9.22442 5.665 9.18441 5.58 9.14441 5.49333C9.09941 5.395 9.05275 5.29667 9.00608 5.20333C8.97275 5.13167 8.93442 5.065 8.90775 4.99833L8.62275 4.47167C8.58275 4.4 8.64941 4.315 8.72775 4.33667L10.5111 4.82H10.5161C10.5194 4.82 10.5211 4.82167 10.5228 4.82167L10.7578 4.88667L11.0161 4.96L11.1111 4.98667V3.92667C11.1111 3.415 11.5211 3 12.0278 3C12.2811 3 12.5111 3.10333 12.6761 3.27167C12.8411 3.44 12.9444 3.67 12.9444 3.92667V5.5L13.1344 5.55333C13.1494 5.55833 13.1644 5.565 13.1777 5.575C13.2244 5.61 13.2911 5.66167 13.3761 5.725C13.4428 5.77833 13.5144 5.84333 13.6011 5.91C13.7728 6.04833 13.9777 6.22667 14.2027 6.43167C14.2627 6.48333 14.3211 6.53667 14.3744 6.59C14.6644 6.86 14.9894 7.17667 15.2994 7.52667C15.3861 7.625 15.4711 7.725 15.5577 7.83C15.6444 7.93667 15.7361 8.04167 15.8161 8.14667C15.9211 8.28667 16.0344 8.43167 16.1328 8.58333C16.1794 8.655 16.2328 8.72833 16.2778 8.8C16.4044 8.99167 16.5161 9.19 16.6228 9.38833C16.6678 9.48 16.7144 9.58 16.7544 9.67833C16.8727 9.94333 16.9661 10.2133 17.0261 10.4833C17.0444 10.5417 17.0578 10.605 17.0644 10.6617V10.675C17.0844 10.755 17.0911 10.84 17.0977 10.9267C17.1244 11.2033 17.1111 11.48 17.0511 11.7583C17.0261 11.8767 16.9927 11.9883 16.9527 12.1067C16.9127 12.22 16.8727 12.3383 16.8211 12.45C16.7211 12.6817 16.6027 12.9133 16.4627 13.13C16.4177 13.21 16.3644 13.295 16.3111 13.375C16.2527 13.46 16.1927 13.54 16.1394 13.6183C16.0661 13.7183 15.9878 13.8233 15.9078 13.9167C15.8361 14.015 15.7627 14.1133 15.6827 14.2C15.5711 14.3317 15.4644 14.4567 15.3527 14.5767C15.2861 14.655 15.2144 14.735 15.1411 14.8067C15.0694 14.8867 14.9961 14.9583 14.9294 15.025C14.8178 15.1367 14.7244 15.2233 14.6461 15.295L14.4627 15.4633C14.4361 15.4867 14.4011 15.5 14.3644 15.5H12.9444V17.3217H14.7311C15.1311 17.3217 15.5111 17.18 15.8177 16.92C15.9227 16.8283 16.3811 16.4317 16.9228 15.8333C16.9411 15.8133 16.9644 15.7983 16.9911 15.7917L21.9261 14.365C22.0177 14.3383 22.1111 14.4083 22.1111 14.505Z" />
  </svg>
)

export default OpenSeaLogo