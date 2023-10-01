import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions, ColumnChartOptions, PieChartOptions } from './chart.types';
import { Blog, Payment, Workout } from '../../services/trainer.interface';
import { Store, select } from '@ngrx/store';
import { fetchBlogData, fetchPaymentData, fetchWorkoutsData } from '../../store/trainer.action';
import { blogSelectorData, paymentSelectorData, workoutsSelectorData } from '../../store/trainer.selector';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  userChartOptions!: Partial<ChartOptions>;
  trainerChartOptions!: Partial<ChartOptions>;
  pieChartOptions!: Partial<PieChartOptions>;
  chartOptions!: Partial<ColumnChartOptions>;
  users: number = 0
  blogs: number = 0
  workouts: number = 0
  pendingIncome: number = 0
  GrandTotal: number = 0
  profitIncome: number = 0
  trainerId!: string;

  constructor(private _userStore: Store<Payment[]>, private _blogStore: Store<Blog[]>, private _workoutStore: Store<Workout[]>) {
    this.userChartOptions = this.createChartOptions("Users per month")
    this.chartOptions = this.columnChartOptions()
    this.pieChartOptions = this.piesChartOptions()
  }

  ngOnInit(): void {
    this.trainerId = <string>localStorage.getItem('trainerId');
    if (this.trainerId) {
      this.totalUsers(this.trainerId)
      this.totalBlogs(this.trainerId)
      this.totalWorkouts(this.trainerId)
    }
  }

  totalUsers(trainerId: string) {
    this._userStore.dispatch(fetchPaymentData({ trainerId }))
    this._userStore.pipe(select(paymentSelectorData)).subscribe(
      (data) => {
        const totalAmountsByMonth = new Array(12).fill(null);
        const userCountsByMonth = new Array(12).fill(null);
        const uniqueSet: string[] = []
        data.filter(obj => {
          const joinDate = new Date(obj.paidDate);
          const joinMonth = joinDate.getMonth();
          userCountsByMonth[joinMonth]++;

          const paidDate = new Date(obj.paidDate);
          const amount = obj.amount;
          const monthIndex = paidDate.getMonth();
          totalAmountsByMonth[monthIndex] += amount;
          this.chartOptions.series = [
            {
              name: 'Incomes',
              data: totalAmountsByMonth
            }
          ]
          if (obj.trainer_status === true) {
            this.profitIncome += obj.amount
          }
          this.GrandTotal += obj.amount

          const found = uniqueSet.find(data => data === obj.userId._id)
          if (!found) {
            console.log(obj.userId);  
            uniqueSet.push()
          }
        })

        this.userChartOptions.series = [
          {
            name: 'Users',
            data: userCountsByMonth
          }
        ];
        this.pendingIncome = this.GrandTotal - this.profitIncome
        this.pieChartOptions.series = [this.GrandTotal, this.pendingIncome, this.profitIncome]
        this.users = uniqueSet.length
      })
  }

  totalBlogs(trainerId: string) {
    this._blogStore.dispatch(fetchBlogData());
    this._blogStore.pipe(select(blogSelectorData)).subscribe(data => {
      this.blogs = 0
      data.forEach(data => {
        if (data.trainerId._id === trainerId) {
          this.blogs++
        }
      })
    })
  }

  totalWorkouts(trainerId: string) {
    this._workoutStore.dispatch(fetchWorkoutsData())
    this._workoutStore.pipe(select(workoutsSelectorData)).subscribe(data => {
      this.workouts = 0
      data.forEach(data => {
        if (data.trainerId._id === trainerId) {
          this.workouts++
        }
      })
    })
  }


  columnChartOptions(): Partial<ColumnChartOptions> {
    return {
      series: [
        {
          name: "Value",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        position: "top",
        labels: {
          offsetY: -18
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true,
          offsetY: -35
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + "%";
          }
        }
      },
      title: {
        text: "Monthly Incomes",
        // floating: 0,
        offsetY: 320,
        align: "center",
        style: {
          color: "#444"
        }
      }
    }
  }

  piesChartOptions(): Partial<PieChartOptions> {
    return {
      series: [],
      chart: {
        width: 350,
        type: "pie"
      },
      labels: ["Total", "Pending", "Profit"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    }
  }

  createChartOptions(title: string): Partial<ChartOptions> {
    return {
      series: [
        {
          name: "income",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: title,
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ]
      }
    };
  }
}
