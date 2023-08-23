import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { ChartComponent } from "ng-apexcharts";
import { Blog, PaymentDetails, Trainers, Users, Workout } from '../../services/admin-interface';
import { fetchBlogData, fetchPaymentData, fetchTrainersData, fetchUsersAction, fetchWorkoutsData } from '../../store/admin.action';
import { blogSelectorData, paymentSelectorData, trainersSelectorData, usersSelectorData, workoutsSelectorData } from '../../store/admin.selector';
import { ChartOptions, ColumnChartOptions, PieChartOptions } from './chart.types';

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
  trainers: number = 0
  blogs: number = 0
  workouts: number = 0
  trainerIncome: number = 0
  GrandTotal: number = 0
  profitIncome: number = 0

  constructor(private _userStore: Store<{ users: Users[] }>,
    private _trainerStore: Store<Trainers[]>,
    private _paymentStore: Store<PaymentDetails[]>,
    private _blogsStore: Store<Blog[]>,
    private _workoutStore:Store<Workout[]>) {
    this.userChartOptions = this.createChartOptions("Users per month");
    this.trainerChartOptions = this.createChartOptions("Trainers per month");
    this.chartOptions = this.columnChartOptions()
    this.pieChartOptions = this.piesChartOptions()
  }

  ngOnInit(): void {
    this.totalUsers()
    this.totalTrainers()
    this.totalIncome()
    this.totalBlogs()
    this.totalWorkouts()
  }

  totalUsers() {
    this._userStore.dispatch(fetchUsersAction());
    this._userStore.pipe(select(usersSelectorData)).subscribe((data) => {
      if (data) {
        this.users = data.length
        const userCountsByMonth = new Array(12).fill(null);
        data.forEach(user => {
          const joinDate = new Date(user.joinDate);
          const joinMonth = joinDate.getMonth();
          userCountsByMonth[joinMonth]++;
        });
        this.userChartOptions.series = [
          {
            name: 'Users',
            data: userCountsByMonth
          }
        ];
      }
    })
  }

  totalTrainers() {
    this._trainerStore.dispatch(fetchTrainersData())
    this._trainerStore.pipe(select(trainersSelectorData)).subscribe(data => {
      if (data) {
        this.trainers = data.length
        const trainerCountsByMonth = new Array(12).fill(null);
        data.forEach(trainer => {
          const joinDate = new Date(trainer.joinDate);
          const joinMonth = joinDate.getMonth();
          trainerCountsByMonth[joinMonth]++;
        });
        this.trainerChartOptions.series = [
          {
            name: 'Trainers',
            data: trainerCountsByMonth
          }
        ];
      }
    })
  }

  totalIncome() {
    this._paymentStore.dispatch(fetchPaymentData())
    this._paymentStore.pipe(select(paymentSelectorData)).subscribe(
      (data) => {
        const totalAmountsByMonth = new Array(12).fill(null);
        data.forEach(data => {
          if (data.trainer_status === true) {
            this.trainerIncome += data.amount
          }
          this.GrandTotal += data.amount
          const paidDate = new Date(data.paidDate);
          const amount = data.amount;
          const monthIndex = paidDate.getMonth();
          totalAmountsByMonth[monthIndex] += amount;
          this.chartOptions.series = [
            {
              name: 'Incomes',
              data: totalAmountsByMonth
            }
          ]
        })
        this.profitIncome = this.GrandTotal - this.trainerIncome
        this.pieChartOptions.series = [this.GrandTotal,this.trainerIncome,this.profitIncome]
      })
  }

  totalBlogs(){
    this._blogsStore.dispatch(fetchBlogData());
    this._blogsStore.pipe(select(blogSelectorData)).subscribe(data=>{
      this.blogs = data.length
    })
  }

  totalWorkouts(){
    this._workoutStore.dispatch(fetchWorkoutsData())
    this._workoutStore.pipe(select(workoutsSelectorData)).subscribe(data=>{
      this.workouts = data.length
    })
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

  piesChartOptions(): Partial<PieChartOptions>{
    return {
      series: [],
      chart: {
        width: 350,
        type: "pie"
      },
      labels: ["Total", "Trainers", "Profit"],
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

} 