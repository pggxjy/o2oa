package com.x.query.service.processing;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;

import com.google.common.util.concurrent.ThreadFactoryBuilder;
import com.x.base.core.project.Context;
import com.x.base.core.project.cache.CacheManager;
import com.x.base.core.project.config.Config;
import com.x.base.core.project.config.Query;
import com.x.query.service.processing.schedule.HighFreqDocument;
import com.x.query.service.processing.schedule.HighFreqWork;
import com.x.query.service.processing.schedule.HighFreqWorkCompleted;
import com.x.query.service.processing.schedule.LowFreqDocument;
import com.x.query.service.processing.schedule.LowFreqWork;
import com.x.query.service.processing.schedule.LowFreqWorkCompleted;
import com.x.query.service.processing.schedule.OptimizeIndex;
import com.x.query.service.processing.schedulelocal.HighFreqDocumentLocal;
import com.x.query.service.processing.schedulelocal.HighFreqWorkCompletedLocal;
import com.x.query.service.processing.schedulelocal.HighFreqWorkLocal;
import com.x.query.service.processing.schedulelocal.LowFreqDocumentLocal;
import com.x.query.service.processing.schedulelocal.LowFreqWorkCompletedLocal;
import com.x.query.service.processing.schedulelocal.LowFreqWorkLocal;
import com.x.query.service.processing.schedulelocal.OptimizeIndexLocal;

public class ThisApplication {

    private ThisApplication() {
        // nothing
    }

    public static final IndexWriteQueue indexWriteQueue = new IndexWriteQueue();

    private static ExecutorService threadPool;

    public static ExecutorService threadPool() {
        return threadPool;
    }

    private static void initThreadPool() {
        int maximumPoolSize = Runtime.getRuntime().availableProcessors() + 1;
        ThreadFactory threadFactory = new ThreadFactoryBuilder()
                .setNameFormat(ThisApplication.class.getPackageName() + "-threadpool-%d").build();
        threadPool = new ThreadPoolExecutor(0, maximumPoolSize, 120, TimeUnit.SECONDS, new ArrayBlockingQueue<>(1000),
                threadFactory);
    }

    protected static Context context;

    public static Context context() {
        return context;
    }

    protected static void setContext(Context context) {
        ThisApplication.context = context;
    }

    public static void init() {
        try {
            initThreadPool();
            context.startQueue(indexWriteQueue);
            CacheManager.init(context.clazz().getSimpleName());
            scheduleLowFreqDocument();
            scheduleLowFreqWork();
            scheduleLowFreqWorkCompleted();
            scheduleHighFreqDocument();
            scheduleHighFreqWorkCompleted();
            scheduleHighFreqWork();
            scheduleOptimizeIndex();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void scheduleLowFreqDocument() throws Exception {
        if (BooleanUtils.isTrue(Config.query().index().getLowFreqDocumentEnable())) {
            if (StringUtils.equals(Config.query().index().getMode(), Query.Index.MODE_LOCALDIRECTORY)) {
                context.scheduleLocal(LowFreqDocumentLocal.class,
                        Config.query().index().getLowFreqDocumentCron());
            } else {
                context.schedule(LowFreqDocument.class,
                        Config.query().index().getLowFreqDocumentCron());
            }
        }
    }

    private static void scheduleLowFreqWorkCompleted() throws Exception {
        if (BooleanUtils.isTrue(Config.query().index().getLowFreqWorkCompletedEnable())) {
            if (StringUtils.equals(Config.query().index().getMode(), Query.Index.MODE_LOCALDIRECTORY)) {
                context.scheduleLocal(LowFreqWorkCompletedLocal.class,
                        Config.query().index().getLowFreqWorkCompletedCron());
            } else {
                context.schedule(LowFreqWorkCompleted.class,
                        Config.query().index().getLowFreqWorkCompletedCron());
            }
        }
    }

    private static void scheduleLowFreqWork() throws Exception {
        if (BooleanUtils.isTrue(Config.query().index().getLowFreqWorkEnable())) {
            if (StringUtils.equals(Config.query().index().getMode(), Query.Index.MODE_LOCALDIRECTORY)) {
                context.scheduleLocal(LowFreqWorkLocal.class,
                        Config.query().index().getLowFreqWorkCron());
            } else {
                context.schedule(LowFreqWork.class,
                        Config.query().index().getLowFreqWorkCron());
            }
        }
    }

    private static void scheduleHighFreqDocument() throws Exception {
        if (BooleanUtils.isTrue(Config.query().index().getHighFreqDocumentEnable())) {
            if (StringUtils.equals(Config.query().index().getMode(), Query.Index.MODE_LOCALDIRECTORY)) {
                context.scheduleLocal(HighFreqDocumentLocal.class,
                        Config.query().index().getHighFreqDocumentCron());
            } else {
                context.schedule(HighFreqDocument.class,
                        Config.query().index().getHighFreqDocumentCron());
            }
        }
    }

    private static void scheduleHighFreqWorkCompleted() throws Exception {
        if (BooleanUtils.isTrue(Config.query().index().getHighFreqWorkCompletedEnable())) {
            if (StringUtils.equals(Config.query().index().getMode(), Query.Index.MODE_LOCALDIRECTORY)) {
                context.scheduleLocal(HighFreqWorkCompletedLocal.class,
                        Config.query().index().getHighFreqWorkCompletedCron());
            } else {
                context.schedule(HighFreqWorkCompleted.class,
                        Config.query().index().getHighFreqWorkCompletedCron());
            }
        }
    }

    private static void scheduleHighFreqWork() throws Exception {
        if (BooleanUtils.isTrue(Config.query().index().getHighFreqWorkEnable())) {
            if (StringUtils.equals(Config.query().index().getMode(), Query.Index.MODE_LOCALDIRECTORY)) {
                context.scheduleLocal(HighFreqWorkLocal.class,
                        Config.query().index().getHighFreqWorkCron());
            } else {
                context.schedule(HighFreqWork.class,
                        Config.query().index().getHighFreqWorkCron());
            }
        }
    }

    private static void scheduleOptimizeIndex() throws Exception {
        if (BooleanUtils.isTrue(Config.query().index().getOptimizeIndexEnable())) {
            if (StringUtils.equals(Config.query().index().getMode(), Query.Index.MODE_LOCALDIRECTORY)) {
                context.scheduleLocal(OptimizeIndexLocal.class,
                        Config.query().index().getOptimizeIndexCron());
            } else {
                context.schedule(OptimizeIndex.class,
                        Config.query().index().getOptimizeIndexCron());
            }
        }
    }

    public static void destroy() {
        try {
            CacheManager.shutdown();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
