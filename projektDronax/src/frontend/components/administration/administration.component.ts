import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DronesService } from '../../services/DronesService/drones.service';
import { ManufacturersService } from '../../services/ManufacturersService/manufacturers.service';
import { Manufacturer } from '../../classes/Manufacturer/manufacturer';
import { DiscountsService } from '../../services/Discounts/discounts.service';
import { Discount } from '../../classes/Discount/discount';
import { DateFormatPipe } from "../../pipes/date-format.pipe";

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DateFormatPipe],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css'
})
export class AdministrationComponent {
  selectedAction: string = '' //default vrijednost;
  selectedAttribute: string = '';

  manufacturerForm: FormGroup;
  droneForm: FormGroup;
  discountForm: FormGroup;
  searchForm: FormGroup;
  deleteManuForm: FormGroup;
  deleteDroneForm: FormGroup;
  deleteDiscountForm: FormGroup;

  fileErrorMessage: string | null = null;

  isFormActivated: boolean = false;

  allMantufacturers: Manufacturer[] = [];
  selectedManuId: number | undefined;

  existingImages: string[] = [];
  selectedDroneId: number | undefined;

  selectedDiscountId: number | undefined;

  allDiscounts: Discount[] = [];

  constructor(private fb: FormBuilder, private dronesService: DronesService, private manufacturersService: ManufacturersService,
    private discountsService: DiscountsService) {

    this.manufacturersService.manufacturer$.subscribe((manufacturers) => {
      this.allMantufacturers = manufacturers;
    });

    this.manufacturersService.fetchManufacturers();

    this.manufacturerForm = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required]
    })


    this.droneForm = this.fb.group({
      idManufacturer: ['', Validators.required],
      droneName: ['', Validators.required],
      type: ['',],
      about: ['',],
      manufacturingDate: ['', Validators.required],
      pictures: [null],
      price: ['', [Validators.required, Validators.min(1)]],
    });


    this.discountForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      startDate: [''],
      endDate: ['']
    });


    this.searchForm = this.fb.group({
      idOrName: ['', [Validators.required]]
    });


    this.deleteManuForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      country: [{ value: '', disabled: true }],
    });

    this.deleteDroneForm = this.fb.group({
      idManufacturer: [{ value: '', disabled: true }],
      droneName: [{ value: '', disabled: true }],
      type: [{ value: '', disabled: true }],
      about: [{ value: '', disabled: true }],
      manufacturingDate: [{ value: '', disabled: true }],
      pictures: [{ value: null, disabled: true }],
      price: [{ value: '', disabled: true }],
    });

    this.deleteDiscountForm = this.fb.group({
      amount: [{ value: '', disabled: true }],
      startDate: [{ value: '', disabled: true }],
      endDate: [{ value: '', disabled: true }],
    });

  }

  ngOnInit() {
    this.discountsService.discounts$.subscribe((discounts) => {
      this.allDiscounts = discounts;
    });

    this.discountsService.refreshDiscounts(); // Inicijalno dohvaćanje
  }


  applyDiscountToDrone() {
    if (this.selectedDroneId && this.selectedDiscountId) {
      const discountData = {
        idDrone: this.selectedDroneId,
        idDiscount: this.selectedDiscountId
      };

      this.discountsService.applyDiscount(discountData).subscribe({
        next: () => {
          alert('Discount successfully applied to the drone!');
          this.dronesService.refreshDrones();
        },
        error: (error) => console.error('Error applying discount:', error)
      });
    }
  }


  isDiscountActive(startDate: string, endDate: string): boolean {
    const today = new Date();
    return new Date(startDate) <= today && today <= new Date(endDate);
  }


  submitManufacturer() {
    const manuToAdd: Manufacturer = {
      name: this.manufacturerForm.value.name,
      country: this.manufacturerForm.value.country
    };

    if (this.manufacturerForm.valid) {
      this.manufacturersService.manufacturerAdd(manuToAdd).subscribe({
        next: (response) => {
          console.log('Manufacturer successfully added to DB:', response);
          alert(`Manufacturer "${this.manufacturerForm.value.name}" added to DB successfully`);
          this.manufacturerForm.reset();
        },
        error: (error) => console.error('Error adding Manufacturer to DB -> ', error)
      });
    }
  }


  submitDrone() {
    if (this.droneForm.valid) {
      const formData = new FormData();
      formData.append('idManufacturer', this.droneForm.value.idManufacturer);
      formData.append('droneName', this.droneForm.value.droneName);
      formData.append('type', this.droneForm.value.type);
      formData.append('about', this.droneForm.value.about);
      formData.append('manufacturingDate', this.droneForm.value.manufacturingDate);
      formData.append('price', this.droneForm.value.price);

      const pictures = this.droneForm.value.pictures;
      if (pictures) {
        for (let i = 0; i < pictures.length; i++) {
          formData.append('pictures', pictures[i]);
        }
      }

      this.dronesService.addDrone(formData).subscribe({
        next: (response) => {
          this.dronesService.refreshDrones();
          this.dronesService.refreshDroneDetails(response.droneId);
          alert(`Drone "${this.droneForm.value.droneName}" successfully added!`);
          this.droneForm.reset();
        },
        error: (err) => console.error('Error adding drone:', err)
      });
    }
  }



  editDrone() {
    if (this.droneForm.valid && this.selectedDroneId !== undefined) {
      const formData = new FormData();
      formData.append('idManufacturer', this.droneForm.value.idManufacturer);
      formData.append('droneName', this.droneForm.value.droneName);
      formData.append('type', this.droneForm.value.type);
      formData.append('about', this.droneForm.value.about);
      formData.append('manufacturingDate', this.droneForm.value.manufacturingDate);
      formData.append('price', this.droneForm.value.price);

      const newImages = this.droneForm.value.pictures;
      if (newImages && newImages.length > 0) {
        for (let i = 0; i < newImages.length; i++) {
          formData.append('pictures', newImages[i]);
        }
      } else {
        this.existingImages.forEach((image: string) => {
          formData.append('existingPictures[]', image);
        });
      }

      this.dronesService.editDrone(this.selectedDroneId, formData).subscribe({
        next: (response) => {
          console.log('Drone updated successfully:', response);
          alert(`Drone "${this.droneForm.value.droneName}" updated successfully`);

          // Konverzija broja u string prije slanja
          this.dronesService.refreshDroneDetails(String(this.selectedDroneId));

          this.droneForm.reset();
          this.isFormActivated = false;
        },
        error: (error) => console.error('Error updating Drone:', error)
      });
    }
  }



  deleteDrone() {
    const confirmDelete = window.confirm('Are you sure you want to delete this Drone?');
    if (confirmDelete && this.selectedDroneId !== undefined) {
      const droneData = this.deleteDroneForm.getRawValue(); // Uključuje disabled polja

      this.dronesService.deleteDrone(this.selectedDroneId).subscribe({
        next: (response) => {
          console.log('Drone successfully deleted:', response);
          alert(`Drone deleted successfully`);

          // Očisti slike nakon brisanja
          this.existingImages = [];

          this.isFormActivated = false;
        },
        error: (error) => console.error('Error deleting Drone -> ', error)
      });
    }
    this.searchForm.reset();
  }





  submitDiscount() {
    if (this.discountForm.valid) {
      const discountToAdd: Discount = {
        amount: this.discountForm.value.amount,
        startDate: this.discountForm.value.startDate,
        endDate: this.discountForm.value.endDate
      };

      this.discountsService.addDiscount(discountToAdd).subscribe({
        next: (response) => {
          alert(`Discount "${this.discountForm.value.amount}%" added to DB successfully`);
          this.discountForm.reset();
          this.discountsService.refreshDiscounts(); // Osvježavanje popusta
        },
        error: (error) => console.error('Error adding Discount to DB -> ', error)
      });
    }
  }



  populateManufacturerForm(manufacturer: Manufacturer) {
    if (this.selectedAction === 'delete') {
      this.deleteManuForm.patchValue({
        name: manufacturer.name,
        country: manufacturer.country
      })
    }
    else {
      this.manufacturerForm.patchValue({
        name: manufacturer.name,
        country: manufacturer.country
      });
    }
  }

  populateDroneForm(drone: any) {
    if (this.selectedAction === 'edit' || this.selectedAction === 'delete') {
      const formToUpdate = this.selectedAction === 'edit' ? this.droneForm : this.deleteDroneForm;

      formToUpdate.patchValue({
        idManufacturer: drone.idManufacturer,
        droneName: drone.name,
        type: drone.type,
        about: drone.about,
        manufacturingDate: drone.manufacturingDate ? new Date(drone.manufacturingDate).toISOString().split('T')[0] : '',
        price: drone.price
      });

      this.dronesService.droneImages$.subscribe(images => {
        this.existingImages = images;
      });

      this.dronesService.refreshDroneDetails(String(drone.idDrone));

      // Postavi ID nakon popunjavanja forme
      this.selectedDroneId = drone.idDrone;
    }
  }





  populateDiscountForm(discount: Discount) {
    if (this.selectedAction === 'edit') {
      this.discountForm.patchValue({
        amount: discount.amount,
        startDate: discount.startDate ? new Date(discount.startDate).toISOString().split('T')[0] : '',
        endDate: discount.endDate ? new Date(discount.endDate).toISOString().split('T')[0] : ''
      });
    }
    else if (this.selectedAction === 'delete') {
      this.deleteDiscountForm.patchValue({
        amount: discount.amount,
        startDate: discount.startDate ? new Date(discount.startDate).toISOString().split('T')[0] : '',
        endDate: discount.endDate ? new Date(discount.endDate).toISOString().split('T')[0] : ''
      });
    }
  }


  /*   formatDate(date: Date | string): string {
      if (!date) return '';
      if (typeof date === 'string') {
        date = new Date(date);
      }
      return date.toISOString().split('T')[0];
    } */

  searchAttribute(idOrName: string) {
    if (this.selectedAttribute === 'manufacturer') {
      this.manufacturersService.getManufacturer(idOrName).subscribe({
        next: (manufacturer) => {
          /* console.log('Mafunacturer: ', manufacturer); */
          this.isFormActivated = true;
          this.populateManufacturerForm(manufacturer);
          this.selectedManuId = manufacturer.idManufacturer;
        },
        error: (error) => {
          console.error('Error fetching Manufacturer from DB -> ', error);
          alert(error.error.message || 'Error fetching Manufacturer from DB');
          this.isFormActivated = false;
        }
      });
    }
    else if (this.selectedAttribute === 'drone') {
      this.dronesService.getDrone(idOrName).subscribe({
        next: (drone) => {
          this.isFormActivated = true;
          this.selectedDroneId = drone.idDrone;
          this.populateDroneForm(drone);
        },
        error: (error) => {
          console.error('Error fetching Drone from DB -> ', error);
          alert(error.error.message || 'Error fetching Manufacturer from DB');
          this.isFormActivated = false;
        }
      })
    }

    else if (this.selectedAttribute === 'discount') {
      if (this.selectedAction === 'apply') {
        this.dronesService.getDrone(idOrName).subscribe({
          next: (drone) => {
            this.isFormActivated = true;
            this.selectedDroneId = drone.idDrone;
          },
          error: (error) => {
            console.error('Error fetching Drone from DB -> ', error);
            alert(error.error.message || 'Error fetching Manufacturer from DB');
            this.isFormActivated = false;
          }
        })
      }
      else {
        this.discountsService.getDiscount(idOrName).subscribe({
          next: (discount) => {
            this.isFormActivated = true;
            this.selectedDiscountId = discount.idDiscount;
            this.populateDiscountForm(discount);
          },
          error: (error) => {
            console.error('Error fetching Discount from DB -> ', error);
            alert(error.error.message || 'Error fetching Discount from DB');
            this.isFormActivated = false;
          }
        })
      }

    }

  }

  onSearchInputChange() {
    this.isFormActivated = false;
    /* this.searchForm.reset(); */
  }

  editManufacturer() {
    const manuToEdit: Manufacturer = {
      idManufacturer: this.selectedManuId!,
      name: this.manufacturerForm.value.name,
      country: this.manufacturerForm.value.country
    };
    /* console.log(manuToEdit); */

    this.manufacturersService.editManufacturer(manuToEdit).subscribe({
      next: (res) => {
        console.log(res.message);
        alert(res.message);
        this.manufacturerForm.reset();
        this.isFormActivated = false;
      },
      error: (error) => {
        console.error('Error editing Manufacturer -> ', error);
        alert('Error editing Manufacturer');
      }
    })
  }

  deleteManufacturer() {
    const confirm = window.confirm('Are you sure you want to delete this Manufacturer?');
    if (confirm) {
      const manuToDelete: Manufacturer = {
        idManufacturer: this.selectedManuId!,
        name: this.deleteManuForm.value.name,
        country: this.deleteManuForm.value.country
      };


      this.manufacturersService.deleteManufacturer(manuToDelete).subscribe({
        next: (res) => {
          console.log(res.message);
          alert(`Manufacturer "${manuToDelete.name}" successfully deleted!`);
          this.deleteManuForm.reset();
          this.isFormActivated = false;
        },
        error: (error) => {
          console.error('Error deleting Manufacturer -> ', error);
          alert('Error deleting Manufacturer');
        }
      });
    }
  }

  editDiscount() {
    const discountToEdit: Discount = {
      idDiscount: this.selectedDiscountId!,
      amount: this.discountForm.value.amount,
      startDate: this.discountForm.value.startDate,
      endDate: this.discountForm.value.endDate,
    };
  
    this.discountsService.editDiscount(discountToEdit).subscribe({
      next: (res) => {
        alert(res.message);
        this.discountForm.reset();
        this.isFormActivated = false;
        this.discountsService.refreshDiscounts(); // Osvježavanje popusta
      },
      error: (error) => {
        console.error('Error editing Discount -> ', error);
        alert('Error editing Discount');
      }
    });
  }


  deleteDiscount() {
    const confirm = window.confirm('Are you sure you want to delete this Discount?');
    if (confirm) {
      const discountToDelete: Discount = {
        idDiscount: this.selectedDiscountId!,
        amount: this.deleteDiscountForm.value.amount,
        startDate: this.deleteDiscountForm.value.startDate,
        endDate: this.deleteDiscountForm.value.endDate,
      };

      if (discountToDelete.idDiscount) {
        this.discountsService.deleteDiscount(discountToDelete.idDiscount).subscribe({
          next: (res) => {
            console.log(res.message);
            alert(`Discount "${discountToDelete.amount}" successfully deleted!`);
            this.deleteManuForm.reset();
            this.isFormActivated = false;
            this.discountsService.refreshDiscounts();
          },
          error: (error) => {
            console.error('Error deleting Discount -> ', error);
            alert('Error deleting Discount');
          }
        });
      }

    }
  }


  handleFileUpload(event: any) {
    const files = event.target.files;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    this.fileErrorMessage = null;

    const invalidFiles: string[] = [];
    const validFiles: File[] = [];

    for (const file of files) {
      if (allowedTypes.includes(file.type)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    }

    if (invalidFiles.length > 0) {
      this.fileErrorMessage = `Invalid file(s): ${invalidFiles.join(', ')}. Only JPG, PNG, or WEBP formats are allowed.`;
      // Clear the file input
      event.target.value = '';
    } else {
      this.droneForm.patchValue({ pictures: validFiles });
      this.droneForm.get('pictures')?.updateValueAndValidity();
    }
  }


}
