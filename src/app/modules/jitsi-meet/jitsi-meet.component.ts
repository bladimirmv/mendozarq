import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Usuario } from '@app/shared/models/usuario.interface';
import { TitleCasePipe } from '@angular/common';


declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-jitsi-meet',
  templateUrl: './jitsi-meet.component.html',
  styleUrls: ['./jitsi-meet.component.scss']
})
export class JitsiMeetComponent implements OnInit, AfterViewInit {
  private domain: string = "meet.jit.si";
  private room: string = '';
  private options: any;
  api: any;
  private user: Usuario = {} as Usuario;




  constructor(
    private router: Router,
    private authSvc: AuthService,
    private activatedRoute: ActivatedRoute,
    private titlecasePipe: TitleCasePipe
  ) {

  }

  ngOnInit(): void {

    this.room = this.activatedRoute.snapshot.parent.parent.params.uuid;

    this.authSvc.usuario$
      .subscribe((usr: Usuario) => {
        this.user = usr;
      })
  }

  ngAfterViewInit(): void {

    if (this.room.length) {
      this.options = {

        roomName: this.room,
        width: '100%',
        height: 550,
        configOverwrite:
        {
          startWithAudioMuted: true,
          remoteVideoMenu:
          {
            disableKick: true,
          },
          prejoinPageEnabled: true,
        },
        parentNode: document.querySelector("#jitsi-iframe"),
        userInfo: {
          displayName: this.titlecasePipe.transform(`${this.user.nombre} ${this.user.apellidoPaterno} ${this.user.apellidoMaterno}`),
          email: this.user.correo
        }
      };

      this.api = new JitsiMeetExternalAPI(this.domain, this.options);
    }

    // Event handlers
    this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft,
      participantJoined: this.handleParticipantJoined,
      videoConferenceJoined: this.handleVideoConferenceJoined,
      videoConferenceLeft: this.handleVideoConferenceLeft,
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus
    });


  }




  handleClose = () => {
    console.log("handleClose");
  }

  handleParticipantLeft = async (participant) => {
    console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
    const data = await this.getParticipants();
  }

  handleParticipantJoined = async (participant) => {
    console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
    const data = await this.getParticipants();
  }

  handleVideoConferenceJoined = async (participant) => {
    console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
    const data = await this.getParticipants();
  }

  handleVideoConferenceLeft = () => {
    const container: HTMLDivElement = document.querySelector('#jitsi-container');
    const e: HTMLDivElement = document.querySelector("#jitsi-iframe");
    const newDiv: HTMLDivElement = document.createElement('div');

    e.parentElement.removeChild(e);

    newDiv.id = 'jitsi-iframe';
    container.appendChild(newDiv)




    this.options = {

      roomName: this.room,
      width: '100%',
      height: 550,
      configOverwrite:
      {
        startWithAudioMuted: true,
        remoteVideoMenu:
        {
          disableKick: true,
        },
        prejoinPageEnabled: true,
      },
      parentNode: document.querySelector("#jitsi-iframe"),
      userInfo: {
        displayName: this.titlecasePipe.transform(`${this.user.nombre} ${this.user.apellidoPaterno} ${this.user.apellidoMaterno}`),
        email: this.user.correo
      }
    };

    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
  }

  handleMuteStatus = (audio) => {
    console.log("handleMuteStatus", audio); // { muted: true }
  }

  handleVideoStatus = (video) => {
    console.log("handleVideoStatus", video); // { muted: true }
  }

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); // get all participants
      }, 500)
    });
  }



}
