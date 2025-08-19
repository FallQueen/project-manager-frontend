import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-profile-info",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: "./profile-info.component.html",
  styleUrls: ["./profile-info.component.css"]
})
export class ProfileInfoComponent implements OnChanges {
  @Input() name!: string;
  @Input() email!: string;
  @Input() role!: string;
  @Input() bio!: string;

  // tambahan untuk kontrol auto-close
  @Input() expanded: boolean = true;  
  @Input() visible: boolean = false;

  isOpen = false;

  ngOnChanges(changes: SimpleChanges) {
    // kalau sidebar collapse → auto tutup
    if (changes['expanded'] && !this.expanded) {
      this.isOpen = false;
    } else {
      this.isOpen = this.visible;
    }
  }
}
