import { Component } from '@angular/core';

interface Vehicle {
  name: string;
  type: string;
  registration: string;
  owner: string;
  image: string | null; // ✅ allow null
}

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent {
  vehicles: Vehicle[] = [];

  // ✅ include image property in initialization
  newVehicle: Vehicle = { name: '', type: '', registration: '', owner: '', image: null };

  previewImage: string | ArrayBuffer | null = null;

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  addVehicle() {
    if (
      this.newVehicle.name.trim() &&
      this.newVehicle.type.trim() &&
      this.newVehicle.registration.trim() &&
      this.newVehicle.owner.trim()
    ) {
      const vehicleData: Vehicle = {
        ...this.newVehicle,
        image: this.previewImage ? this.previewImage.toString() : null
      };

      this.vehicles.push(vehicleData);

      // ✅ Reset form
      this.newVehicle = { name: '', type: '', registration: '', owner: '', image: null };
      this.previewImage = null;
    } else {
      alert('Please fill in all fields before adding a vehicle.');
    }
  }

  deleteVehicle(index: number) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicles.splice(index, 1);
    }
  }
}
