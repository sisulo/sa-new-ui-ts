import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MetricService} from '../../metric.service';
import {Owner} from '../../common/models/dtos/owner.dto';
import {StorageEntityDetailRequestDto} from '../../common/models/dtos/storage-entity-detail-request.dto';

@Component({
  selector: 'app-import-csv-data',
  templateUrl: './import-csv-data.component.html',
  styleUrls: ['./import-csv-data.component.css']
})
export class ImportCsvDataComponent implements OnInit {
  @Input()
  keyColumn: string;
  @Input()
  data: Owner[];
  header: string[] = [];
  fileName: string = null;
  dataVo: any[] = [];
  dataCount = 0;
  @Output()
  importFinished = new EventEmitter();

  constructor(private metricService: MetricService) {
  }

  ngOnInit() {
  }

  changeListener(files: FileList) {
    console.log(files);
    if (files === undefined || files.length === 0) {
      return;
    }
    const file: File = files.item(0);
    console.log(file.name);
    console.log(file.size);
    console.log(file.type);
    this.fileName = file.name;
    // File reader method
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const csv: string = reader.result as string;
      const allTextLines = csv.split(/\r|\n|\r/);
      // Table Headings
      this.header = allTextLines[0].split(',');
      const csvData = allTextLines.slice(1, allTextLines.length).map(line => line.split(','));
      this.dataVo = csvData.map(line => {
        const vo = [];
        this.header.forEach((column, index) => {
          vo[column] = line[index];
        });
        return vo;
      });
    };
  }

  reset() {
    this.fileName = null;
    this.dataCount = 0;
  }

  updateData() {
    this.dataVo.map(vo => {
      const foundData = this.data.find(owner => owner[this.keyColumn] === vo[this.keyColumn]);
      if (foundData === undefined) {
        throw new Error(vo[this.keyColumn] + ' not found');
      }
      const dto = new StorageEntityDetailRequestDto();
      this.header.forEach(column => {
        dto[column] = vo[column];
      });
      return this.metricService.updateStorageEntity(foundData.id, dto).subscribe(data => {
          this.dataCount++;
          if (this.dataVo.length === this.dataCount) {
            this.importFinished.emit();
            this.reset();
          }

        }
      );
    });

  }
}
