import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isSupported = false;
  barcodes: any[] = [];

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then((result) => {
      console.log(result);
    })
    BarcodeScanner.installGoogleBarcodeScannerModule();
    const { barcodes } = await BarcodeScanner.scan();
    barcodes.forEach(barcode => {
      const formattedData = this.formatDisplayValue(barcode.displayValue);
      this.barcodes.push({
        format: barcode.format,
        rawValue: barcode.rawValue,
        formattedData: formattedData
      });
    });
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  formatDisplayValue(displayValue: string): any[] {
    const fields = [
      'ID',
      'First Name',
      'Last Name',
      'Middle Name',
      'Gender',
      'Location',
      'DOB',
      'Nationality',
      'Field 1',
      'Field 2',
      'Field 3',
      'Field 4',
      'Field 5',
      'Donor Status',
      'Issue Date',
      'Expiry Date',
      'Additional Info'
    ];

    const values = displayValue.split('|');
    return values.map((value, index) => ({
      label: fields[index] || `Field ${index + 1}`,
      value: value
    }));
  }
}
