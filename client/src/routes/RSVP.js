import React from "react";
import logo from '../FinalLogo.png';
import InfoCard from '../components/InfoCard';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";

class RSVP extends React.Component {
    async componentDidMount() {
        if (!this.context.applied) {
          this.context.hasApplied();
        }
        if (!this.context.accepted) {
            this.context.isAccepted();
        }
      }

    
}