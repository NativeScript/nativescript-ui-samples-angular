import { Component, OnInit, OnDestroy, Injectable, ViewChild } from "@angular/core";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { ActivatedRoute } from '@angular/router';
import * as frameModule from "tns-core-modules/ui/frame";
import { Page } from "tns-core-modules/ui/page";
import { OptionsService } from "../../navigation/options/options.service";

@Component({
    moduleId: module.id,
    selector: "tk-options",
    templateUrl: "options.component.html",
    styleUrls: ["options.component.css"]
})
@Injectable()
export class OptionsComponent implements OnInit, OnDestroy {
    private _dataItems: ObservableArray<string>;
    private _sub: any;
    private _selectedIndex: number = -1;

    constructor(private _page: Page, private _route: ActivatedRoute, private _optionsService: OptionsService) {
        this._dataItems = new ObservableArray<string>();
    }

    @ViewChild("optionsListView") _listView: any;

    ngOnInit() {
        this._sub = this._route.queryParams.subscribe(
            (params: any) => {
                const items = params['items'];
                this._selectedIndex = +params['selectedIndex'];
                if (items) {
                    const splitItems = items.toString().split(',');
                    this._dataItems = new ObservableArray<string>(splitItems);
                }
            }
        );
        const listView = this._listView.nativeElement;
        const index = this._selectedIndex;
        setTimeout(function () {
            listView.ios.selectRowAtIndexPathAnimatedScrollPosition(NSIndexPath.indexPathForItemInSection(index, 0), false, 0);
        }, 0);
    }

    ngOnDestroy() {
        this._sub.unsubscribe();
    }

    get dataItems(): ObservableArray<string> {
        return this._dataItems;
    }


    public onItemTap(args) {
        this._optionsService.paramValue = args.view && args.view.bindingContext;
        frameModule.topmost().goBack();
    }
}