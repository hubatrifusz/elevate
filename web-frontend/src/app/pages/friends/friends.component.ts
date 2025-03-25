import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-friends',
  imports: [NavbarComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent {
  search: FormControl = new FormControl();

  searchFriend() {}
}
