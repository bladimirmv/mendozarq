import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JitsiMeetComponent } from './jitsi-meet.component';

const routes: Routes = [{ path: '', component: JitsiMeetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JitsiMeetRoutingModule { }
