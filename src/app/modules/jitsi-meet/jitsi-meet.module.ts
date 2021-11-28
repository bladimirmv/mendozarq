import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JitsiMeetRoutingModule } from './jitsi-meet-routing.module';
import { JitsiMeetComponent } from './jitsi-meet.component';
import { TitleCasePipe } from '@angular/common';

@NgModule({
  declarations: [JitsiMeetComponent],
  imports: [
    CommonModule,
    JitsiMeetRoutingModule
  ],
  providers: [TitleCasePipe]
})
export class JitsiMeetModule { }
